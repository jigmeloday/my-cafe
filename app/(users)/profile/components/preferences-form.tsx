"use client";

import { ActionForm } from "@/components/shared/action-form";
import { SwitchField } from "@/components/shared/switch-field";
import { useActionForm } from "@/hooks/use-action-form";
import {
  preferencesSchema,
  type PreferencesInput,
} from "@/lib/validations/profile.schema";
import { updatePreferencesAction } from "@/server/actions/account.actions";

import { PROFILE_COPY } from "../constant/profile.constant";
import {
  CHANNEL_OPTIONS,
  PRIVACY_OPTIONS,
  TOPIC_OPTIONS,
} from "../constant/profile-options.constant";
import type { ProfileUser, SwitchOption } from "../model/profile.type";

const GROUPS = [
  {
    title: PROFILE_COPY.channelsTitle,
    description: PROFILE_COPY.channelsDescription,
    options: CHANNEL_OPTIONS,
  },
  {
    title: PROFILE_COPY.topicsTitle,
    description: PROFILE_COPY.topicsDescription,
    options: TOPIC_OPTIONS,
  },
  {
    title: PROFILE_COPY.privacyTitle,
    description: PROFILE_COPY.privacyDescription,
    options: PRIVACY_OPTIONS,
  },
] satisfies { title: string; description: string; options: SwitchOption[] }[];

export function PreferencesForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending } = useActionForm(
    preferencesSchema,
    updatePreferencesAction,
    user.preferences,
  );
  const channelError = form.formState.errors.channels?.email?.message;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save preferences"
      className="max-w-2xl space-y-8"
    >
      {GROUPS.map(({ title, description, options }) => (
        <section key={title} className="space-y-1">
          <h3>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="divide-y border-y">
            {options.map(({ name, label, description: text }) => (
              <SwitchField<PreferencesInput>
                key={name}
                control={form.control}
                name={name as never}
                label={label}
                description={text}
              />
            ))}
          </div>
        </section>
      ))}
      {channelError && (
        <p role="alert" className="text-sm text-destructive">
          {channelError}
        </p>
      )}
    </ActionForm>
  );
}
