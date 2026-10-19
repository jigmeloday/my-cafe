"use client";

import { useEffect } from "react";
import { CircleCheck } from "lucide-react";

import { SelectField } from "@/components/shared/select-field";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { authClient } from "@/lib/auth-client";
import { CONTACT_TOPICS } from "@/lib/contact";
import { contactSchema } from "@/lib/validations/contact.schema";
import { sendContactAction } from "@/server/actions/contact.actions";

import { CONTACT_COPY } from "../constant/contact.constant";

const TOPIC_OPTIONS = CONTACT_TOPICS.map((t) => ({ value: t.id, label: t.label }));

export function ContactForm() {
  const { form, submit, result, pending } = useActionForm(contactSchema, sendContactAction, { name: "", email: "", topic: "", message: "", hpCheck: "" });
  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;
  const { data } = authClient.useSession();

  // Signed in? Fill in their name and email, unless they've already typed something.
  useEffect(() => {
    const user = data?.user;
    if (!user) return;
    if (!getValues("name")) setValue("name", user.name);
    if (!getValues("email")) setValue("email", user.email);
  }, [data, getValues, setValue]);

  if (result?.ok) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl bg-success/10 p-5 text-sm">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p>{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Your name" error={errors.name?.message} autoComplete="name" maxLength={80} {...register("name")} />
        <Input label="Your email" hint="We'll reply here." error={errors.email?.message} type="email" autoComplete="email" maxLength={120} {...register("email")} />
      </div>
      <SelectField control={control} name="topic" label="What is it about?" options={TOPIC_OPTIONS} placeholder="Choose a topic" error={errors.topic?.message} />
      <Textarea label="Your message" hint={`${watch("message")?.length ?? 0}/2000. ${CONTACT_COPY.tips}`} error={errors.message?.message} rows={6} maxLength={2000} {...register("message")} />
      {/* A trap for bots. People never see or reach it; software that fills in every box gives itself away. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input type="text" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore {...register("hpCheck")} />
        </label>
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : CONTACT_COPY.submit}
      </Button>
    </form>
  );
}
