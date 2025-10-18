'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

export function SessionProviderWrapper({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
