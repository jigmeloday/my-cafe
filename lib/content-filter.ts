import { BLOCKED_WORDS } from "./content-filter.constant";

/** Look-alike characters people swap in to get past a filter: "s3x", "p0rn", "$ex", "n@ked". */
const LOOK_ALIKES: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i" };

/** "sexxxy" -> "sexy": a letter typed many times counts once. */
const squeeze = (word: string) => word.replace(/(.)\1+/g, "$1");

const BLOCKED = new Set<string>(BLOCKED_WORDS);
// A word that squeezes down to almost nothing ("xxx" -> "x") is left out, so a lone letter can never be a hit.
const MIN_SQUEEZED = 3;
const BLOCKED_SQUEEZED = new Set(BLOCKED_WORDS.map(squeeze).filter((w) => w.length >= MIN_SQUEEZED));

const MIN_SPELLED_OUT = 3;

/** The words in a piece of text, with look-alike characters turned back into letters. */
function wordsOf(text: string): string[] {
  const plain = text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0134-57@$!]/g, (c) => LOOK_ALIKES[c]);
  return plain.split(/[^a-z]+/).filter(Boolean);
}

const isBlocked = (word: string) => BLOCKED.has(word) || BLOCKED_SQUEEZED.has(squeeze(word));

/** Letters spelled out one at a time ("s e x", "p.o.r.n") are joined back into words and checked too. */
function spelledOut(words: string[]): string[] {
  const joined: string[] = [];
  for (let start = 0; start < words.length; start++) {
    let run = "";
    for (let i = start; i < words.length && words[i].length === 1; i++) {
      run += words[i];
      if (run.length >= MIN_SPELLED_OUT) joined.push(run);
    }
  }
  return joined;
}

/** The first blocked word found in the text, or null when it is fine. */
export function findBlockedWord(text: string): string | null {
  if (!text) return null;
  const words = wordsOf(text);
  return [...words, ...spelledOut(words)].find(isBlocked) ?? null;
}
