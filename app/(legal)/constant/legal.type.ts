/** A paragraph, or a bulleted list. Pages are written as plain data, so the wording is easy to review and edit. */
export type LegalBlock = { p: string } | { ul: string[] };

export interface LegalSection {
  /** Used for the contents list and for links to the section, e.g. /terms#coins */
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  /** One or two sentences in plain words, before the contents. */
  intro: string;
  sections: LegalSection[];
}
