export interface Notice {
  id: string;
  title: string;
  description: string;
  href: string | null;
  /** "YYYY-MM-DDTHH:mm" */
  at: string;
}

/** Good news is shown in green; anything that needs attention keeps the warning colour. */
export type NoticeTone = "success" | "warning";
