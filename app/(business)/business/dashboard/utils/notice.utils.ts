import type { NoticeTone } from "../model/notice.type";

/** Words that mean a message is about a problem, not good news ("wasn't approved", "taken down", "was reported"). */
const PROBLEM = /wasn't|not approved|removed|taken down|reported|suspend|refund/i;

/** Approvals and verification are green; warnings, removals and refusals stay in the warning colour. */
export const noticeTone = (title: string, description: string): NoticeTone => (PROBLEM.test(`${title} ${description}`) ? "warning" : "success");
