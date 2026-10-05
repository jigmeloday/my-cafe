import { ACCOUNT_TYPE_LABELS } from "../constant/profile.constant";
import type { ProfileStat, ProfileUser } from "../model/profile.type";
import { getInitials } from "../utils/profile.utils";

interface ProfileHeaderProps {
  user: ProfileUser;
  stats: ProfileStat[];
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <header className="flex items-center gap-4 border-b pb-6">
      <div
        aria-hidden
        className="grid size-16 shrink-0 place-items-center rounded-full bg-maroon-soft text-xl font-semibold text-primary"
      >
        {getInitials(user.personal.name)}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate">{user.personal.name}</h1>
        <p className="truncate text-sm text-muted-foreground">
          {user.email} · {ACCOUNT_TYPE_LABELS[user.accountType]} · {user.joined}
        </p>
      </div>
      <dl className="hidden gap-6 text-center sm:flex">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <dd className="text-lg font-semibold">{value}</dd>
            <dt className="text-xs text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </header>
  );
}
