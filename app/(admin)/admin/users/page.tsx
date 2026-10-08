import type { Metadata } from "next";

import { UsersExplorer } from "./components/users-explorer";
import { USERS_COPY } from "./constant/user.constant";

export const metadata: Metadata = { title: "Users — kuzu admin" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{USERS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {USERS_COPY.subtitle}{" "}
          <span className="text-xs">{USERS_COPY.sampleNote}</span>
        </p>
      </header>
      <UsersExplorer />
    </div>
  );
}
