/**
 * Makes search text safe to use inside a database "contains" search. In a LIKE/ILIKE pattern, % means
 * "anything" and _ means "any one character", so a person searching for "50%" or "a_b" would otherwise
 * match far more than they typed. This turns those characters (and the escape character itself) literal.
 */
export const escapeLike = (text: string) => text.replace(/[\\%_]/g, "\\$&");

const MAX_WORDS = 5;
const MAX_WORD_LENGTH = 50;
const MIN_PHONE_DIGITS = 3;

export interface SearchTerms {
  /** Every one of these must appear somewhere (name or email), in any order. */
  words: string[];
  /** Set when the whole search looks like a phone number (e.g. "+975 17 123 456"): just its digits. */
  phoneDigits: string | null;
}

/**
 * Splits what someone typed into search terms. "wangmo pema" becomes two words that must both match,
 * so it finds "Pema Wangmo". If everything typed is digits, spaces, "+", "-" or brackets (and there are
 * at least 3 digits), it is also treated as a phone number, so "17 123 456" finds +97517123456.
 */
export function parseSearch(text: string): SearchTerms {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_WORDS)
    .map((word) => word.slice(0, MAX_WORD_LENGTH));

  const looksLikePhone = words.length > 0 && words.every((word) => /^[+\d()-]+$/.test(word));
  const digits = looksLikePhone ? words.join("").replace(/\D/g, "") : "";
  return { words, phoneDigits: digits.length >= MIN_PHONE_DIGITS ? digits : null };
}
