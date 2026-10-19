/** Scrolls the first form error (or invalid field) into view, so a failed submit never looks like nothing happened. */
export function scrollToFirstProblem() {
  const target = document.querySelector<HTMLElement>('[role="alert"], [aria-invalid="true"]');
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}
