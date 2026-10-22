/**
 * Words that can't appear in what a business publishes (promotion and banner text). Whole words only, in lower
 * case, so "Sussex" is never caught for containing "sex". Add or remove words here: nothing else needs to change.
 * Local-language words are only as good as this list, so it is worth extending as real cases come up.
 */
export const BLOCKED_WORDS = [
  // Sexual
  "sex", "sexy", "sexual", "sexually", "sexting", "porn", "porno", "pornography", "pornographic", "xxx", "xxxx", "nsfw",
  "nude", "nudes", "nudity", "naked", "erotic", "erotica", "fetish", "hentai", "orgy", "orgies", "escort", "escorts",
  "prostitute", "prostitutes", "prostitution", "brothel", "hooker", "hookers", "stripper", "strippers", "striptease",
  "blowjob", "handjob", "cumshot", "pussy", "slut", "sluts", "whore", "whores", "onlyfans",
  // Swearing
  "fuck", "fucker", "fucking", "motherfucker", "shit", "bullshit", "bitch", "bitches", "asshole", "dickhead", "cunt",
  // Hindi and Nepali, written in English letters
  "randi", "madarchod", "bhenchod", "behenchod", "chutiya", "gandu", "bhosdike", "lauda",
] as const;
