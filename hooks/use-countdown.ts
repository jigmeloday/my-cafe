"use client";

import { useEffect, useState } from "react";

/** Counts down from `seconds` to 0, once a second. `restart` starts it again (e.g. after resending). */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => setLeft((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return { left, restart: () => setLeft(seconds) };
}
