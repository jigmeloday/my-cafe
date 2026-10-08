"use client";

import { FilterChips } from "./filter-chips";
import { SearchInput } from "./search-input";

interface ListToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder: string;
  /** Status chips. `count` is shown next to the label. */
  filters: { id: string; label: string; count: number }[];
  active: string;
  onActiveChange: (id: string) => void;
}

/** Search box plus status chips with counts, shared by the admin lists. */
export function ListToolbar({
  query,
  onQueryChange,
  placeholder,
  filters,
  active,
  onActiveChange,
}: ListToolbarProps) {
  const options = filters.map(({ id, label, count }) => ({
    id,
    label: `${label} ${count}`,
  }));

  return (
    <div className="space-y-3">
      <SearchInput
        className="sm:max-w-sm"
        aria-label={placeholder}
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <FilterChips
        options={options}
        active={active}
        onChange={onActiveChange}
      />
    </div>
  );
}
