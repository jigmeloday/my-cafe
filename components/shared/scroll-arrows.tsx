import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ScrollArrowsProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ScrollArrows({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: ScrollArrowsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="icon-sm"
        className="rounded-full"
        aria-label="Previous"
        disabled={!canPrev}
        onClick={onPrev}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="secondary"
        size="icon-sm"
        className="rounded-full"
        aria-label="Next"
        disabled={!canNext}
        onClick={onNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
