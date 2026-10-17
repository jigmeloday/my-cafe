"use client";

import { useEffect, useRef, useState } from "react";

interface LiveSearchOptions {
  /** The search currently in the address bar. */
  applied: string;
  /** Called when a search should run. `typing` fires after a pause, `enter` straight away. */
  onSearch: (query: string, source: "typing" | "enter") => void;
  /** How long to wait after the last keystroke. */
  delay?: number;
}

/**
 * Search-as-you-type for lists whose results come from the server (and whose search lives in the address).
 * Asks once per pause in typing, never once per key, and never overwrites what is being typed when the
 * address catches up. If the address changes by itself (Back button, a "Clear filters" link), the box follows.
 */
export function useLiveSearch({ applied, onSearch, delay = 400 }: LiveSearchOptions) {
  const [text, setText] = useState(applied);
  // The searches this box has asked for, newest last, so "the address caught up with me" can be told apart
  // from "the address changed on its own", even when two searches are in flight at once.
  const [asked, setAsked] = useState<string[]>([applied]);
  const [seen, setSeen] = useState(applied);
  const lastAsked = asked[asked.length - 1];

  const latest = useRef(onSearch);
  useEffect(() => {
    latest.current = onSearch;
  });

  if (applied !== seen) {
    setSeen(applied);
    if (!asked.includes(applied)) {
      setText(applied);
      setAsked([applied]);
    }
  }

  const remember = (query: string) => setAsked((previous) => [...previous.slice(-4), query]);

  useEffect(() => {
    const query = text.trim();
    if (query === lastAsked) return;
    const timer = setTimeout(() => {
      remember(query);
      latest.current(query, "typing");
    }, delay);
    return () => clearTimeout(timer);
  }, [text, lastAsked, delay]);

  return {
    text,
    setText,
    /** Search right now (Enter). Does nothing if this exact search was already asked for. */
    submit: () => {
      const query = text.trim();
      if (query === lastAsked) return;
      remember(query);
      onSearch(query, "enter");
    },
    /** Use the typed text as part of another change (like picking a group) and stop the pending search. */
    commit: () => {
      const query = text.trim();
      if (query !== lastAsked) remember(query);
      return query;
    },
  };
}
