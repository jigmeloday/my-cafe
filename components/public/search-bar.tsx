import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SEARCH_FIELDS } from "./constant/site.constant";

export function SearchBar() {
  return (
    <form
      action="/search"
      role="search"
      className="mx-auto flex w-full max-w-2xl items-center rounded-full border bg-surface py-2 pr-2 pl-7 shadow-[0_2px_10px_rgb(0_0_0/0.08)] transition-shadow hover:shadow-[0_4px_16px_rgb(0_0_0/0.12)]"
    >
      {SEARCH_FIELDS.map(({ name, label, placeholder }, i) => (
        <div
          key={name}
          className={cn(
            "flex min-w-0 flex-1 items-center",
            i > 0 && "hidden md:flex lg:hidden xl:flex",
          )}
        >
          {i > 0 && <span className="mr-6 h-8 w-px shrink-0 bg-border" />}
          <label className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold">{label}</span>
            <input
              name={name}
              placeholder={placeholder}
              className="w-full truncate bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      ))}
      <Button
        type="submit"
        size="icon-lg"
        className="ml-3 rounded-full"
        aria-label="Search"
      >
        <Search />
      </Button>
    </form>
  );
}
