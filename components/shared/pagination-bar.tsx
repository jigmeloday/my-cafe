import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { ELLIPSIS, pageRange, pageWindow } from "@/lib/pagination";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** The address of a page, e.g. (2) => "/admin/users?page=2". */
  hrefFor: (page: number) => string;
  /** What is being counted, e.g. "users". */
  noun: string;
}

/** "Showing 11–20 of 47 users" with page links. Plain links, so it works without JavaScript. */
export function PaginationBar({ page, totalPages, total, pageSize, hrefFor, noun }: PaginationBarProps) {
  const { from, to } = pageRange(page, pageSize, total);
  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {from}–{to} of {total} {noun}
      </p>
      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <EdgeLink disabled={page <= 1} href={hrefFor(page - 1)} label="Go to previous page">
                <ChevronLeft />
              </EdgeLink>
            </PaginationItem>
            {pageWindow(page, totalPages).map((item, index) =>
              item === ELLIPSIS ? (
                <PaginationItem key={`gap-${index}`} className="hidden sm:block">
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item} className={item === page ? undefined : "hidden sm:block"}>
                  <Button
                    variant={item === page ? "outline" : "ghost"}
                    size="icon"
                    nativeButton={false}
                    render={<Link href={hrefFor(item)} aria-current={item === page ? "page" : undefined} aria-label={`Page ${item}`} />}
                  >
                    {item}
                  </Button>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <EdgeLink disabled={page >= totalPages} href={hrefFor(page + 1)} label="Go to next page">
                <ChevronRight />
              </EdgeLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function EdgeLink({ disabled, href, label, children }: { disabled: boolean; href: string; label: string; children: React.ReactNode }) {
  // A disabled edge is a plain disabled button, so it can't be followed or focused.
  if (disabled) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={href} aria-label={label} />}>
      {children}
    </Button>
  );
}
