export const PHONE_COUNTRIES = [
  { code: "BT", name: "Bhutan", dial: "+975", flag: "🇧🇹", maxLength: 8 },
] as const;

export type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

export const DEFAULT_PHONE_COUNTRY: PhoneCountry = PHONE_COUNTRIES[0];

// National-number rules per country (without the dial code).
// Bhutan: mobiles are 8 digits starting 17 or 77; landlines are 7 digits.
const NATIONAL_PATTERNS: Record<PhoneCountry["code"], RegExp> = {
  BT: /^(?:(?:17|77)\d{6}|[2-8]\d{6})$/,
};

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
  return NATIONAL_PATTERNS[country.code].test(national);
}

/** Groups digits for display: 17123456 -> "17 123 456", 2123456 -> "2 123 456". */
export function formatNational(digits: string) {
  const split = /^(17|77)/.test(digits) ? 2 : 1;
  const head = digits.slice(0, split);
  const rest = digits.slice(split).match(/.{1,3}/g) ?? [];
  return [head, ...rest].filter(Boolean).join(" ");
}
