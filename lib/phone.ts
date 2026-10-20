import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const PHONE_COUNTRIES = [
  { code: "BT", name: "Bhutan", dial: "+975", flag: "🇧🇹", maxLength: 8 },
] as const;

export type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

export const DEFAULT_PHONE_COUNTRY: PhoneCountry = PHONE_COUNTRIES[0];

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function parsePhone(value: string) {
  const country =
    PHONE_COUNTRIES.find((c) => value.startsWith(c.dial)) ??
    DEFAULT_PHONE_COUNTRY;
  const national = digitsOnly(
    value.startsWith(country.dial) ? value.slice(country.dial.length) : value,
  );
  return { country, national };
}

export function buildPhone(country: PhoneCountry, national: string) {
  const digits = digitsOnly(national).slice(0, country.maxLength);
  return digits ? `${country.dial}${digits}` : "";
}

/** An empty value is valid (the field is optional). */
export function isValidPhone(value: string) {
  if (!value) return true;
  const { country, national } = parsePhone(value);
  // Bhutan Telecom's newer 16 mobiles are missing from Google's data, so accept them here.
  if (country.code === "BT" && /^16\d{6}$/.test(national)) return true;
  // Google's libphonenumber rules decide what a real number looks like for this country.
  const number = parsePhoneNumberFromString(`${country.dial}${national}`, country.code);
  return Boolean(number?.isValid() && number.country === country.code && ["MOBILE", "FIXED_LINE"].includes(number.getType() ?? ""));
}

/** Groups digits for display: 17123456 -> "17 123 456", 2123456 -> "2 123 456". */
export function formatNational(digits: string) {
  const split = /^(16|17|77)/.test(digits) ? 2 : 1;
  const head = digits.slice(0, split);
  const rest = digits.slice(split).match(/.{1,3}/g) ?? [];
  return [head, ...rest].filter(Boolean).join(" ");
}

/** "+97517123456" -> "+975 17 123 456". Unknown formats are shown as saved. */
export function formatPhone(value: string): string {
  if (!value) return "";
  const { country, national } = parsePhone(value);
  return value.startsWith(country.dial) ? `${country.dial} ${formatNational(national)}` : value;
}
