import { BusinessSection } from "./business-section";

/** A titled row of short tags (services or products). Shows nothing when there are none. */
export function OfferingList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <BusinessSection id={title.toLowerCase()} title={title}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border px-3 py-1 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </BusinessSection>
  );
}
