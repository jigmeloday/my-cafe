"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Flag } from "lucide-react";

import { FormMessage } from "@/components/shared/form-message";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { authClient } from "@/lib/auth-client";
import { REPORT_REASONS } from "@/lib/report-reasons";
import { cn } from "@/lib/utils";
import { reportSchema } from "@/lib/validations/report.schema";
import { reportAdAction } from "@/server/actions/report.actions";

interface ReportButtonProps {
  /** Report this promotion... */
  promotionId?: string;
  /** ...or this banner. */
  bannerId?: string;
  /** "link" is a small text link, for tight spaces like a banner. */
  variant?: "button" | "link";
  className?: string;
}

const REASON_OPTIONS = REPORT_REASONS.map((r) => ({ value: r.id, label: r.label }));

function ReportForm({ promotionId, bannerId, onDone }: { promotionId?: string; bannerId?: string; onDone: () => void }) {
  const { form, submit, result, pending } = useActionForm(reportSchema, reportAdAction, { promotionId, bannerId, reason: "", details: "" });
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  if (result?.ok) {
    return (
      <div className="space-y-4">
        <FormMessage tone="success">{result.message ?? "Thank you."}</FormMessage>
        <DialogFooter>
          <Button onClick={onDone}>Done</Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
      <SelectField control={control} name="reason" label="What's wrong?" options={REASON_OPTIONS} placeholder="Choose a reason" error={errors.reason?.message} />
      <Textarea label="Tell us more (optional)" hint={`${watch("details")?.length ?? 0}/500`} error={errors.details?.message} rows={4} maxLength={500} {...register("details")} />
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send report"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * "Report this ad". Signed-out visitors are sent to log in first, so reports come from real accounts (and one
 * person can only report an ad once). Business owners don't see it.
 */
export function ReportButton({ promotionId, bannerId, variant = "button", className }: ReportButtonProps) {
  const pathname = usePathname();
  const { data } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const role = (data?.user as { role?: string } | undefined)?.role;
  if (role === "BUSINESS_OWNER") return null;

  const trigger =
    variant === "link"
      ? cn("text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline", className)
      : className;
  const label = variant === "link" ? "Report ad" : "Report";

  if (!data?.user) {
    return variant === "link" ? (
      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={trigger}>
        {label}
      </Link>
    ) : (
      <Button variant="ghost" size="sm" className={className} nativeButton={false} render={<Link href={`/login?next=${encodeURIComponent(pathname)}`} />}>
        <Flag /> {label}
      </Button>
    );
  }

  return (
    <>
      {variant === "link" ? (
        <button type="button" onClick={() => setOpen(true)} className={trigger}>
          {label}
        </button>
      ) : (
        <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
          <Flag /> {label}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this ad</DialogTitle>
            <DialogDescription>Tell us what is wrong. We review every report, and the business is not told who sent it.</DialogDescription>
          </DialogHeader>
          {/* Mounted only while open, so the form starts fresh each time. */}
          {open && <ReportForm promotionId={promotionId} bannerId={bannerId} onDone={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
