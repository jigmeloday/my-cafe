"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  label: string;
  confirmLabel: string;
  /** Fewest characters the reason must have. */
  minLength?: number;
  onConfirm: (reason: string) => void;
}

/** Asks for a written reason before a serious action, so whoever is affected can be told why. */
export function ReasonDialog({ open, onOpenChange, title, description, label, confirmLabel, minLength = 10, onConfirm }: ReasonDialogProps) {
  const [reason, setReason] = useState("");
  const valid = reason.trim().length >= minLength;

  const close = (next: boolean) => {
    if (!next) setReason("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea label={label} hint={`${reason.trim().length}/300. At least ${minLength} characters.`} rows={4} maxLength={300} value={reason} onChange={(e) => setReason(e.target.value)} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!valid}
            onClick={() => {
              onConfirm(reason.trim());
              close(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
