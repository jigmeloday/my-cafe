"use client";

import { useState } from "react";

import { FormMessage } from "@/components/shared/form-message";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { deleteAccountAction } from "@/server/actions/account.actions";

import { PROFILE_COPY } from "../constant/profile.constant";

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const { run, result } = useAction(deleteAccountAction);

  return (
    <div className="max-w-xl space-y-4">
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          {PROFILE_COPY.dangerButton}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{PROFILE_COPY.dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {PROFILE_COPY.dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{PROFILE_COPY.dialogCancel}</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                run(undefined);
              }}
            >
              {PROFILE_COPY.dialogConfirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
