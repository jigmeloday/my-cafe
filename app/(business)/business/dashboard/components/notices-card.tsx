import type { Notice } from "../model/notice.type";
import { noticeTone } from "../utils/notice.utils";
import { NoticeItem } from "./notice-item";

/** Short messages from Nook about the business (approvals, warnings, removals). Shows nothing when there are none. */
export function NoticesCard({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;

  return (
    <ul aria-label="Messages from Nook" className="space-y-2">
      {notices.map((n) => (
        <NoticeItem key={n.id} notice={n} tone={noticeTone(n.title, n.description)} />
      ))}
    </ul>
  );
}
