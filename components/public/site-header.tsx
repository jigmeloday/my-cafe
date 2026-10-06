import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

import { Brand } from "./brand";
import { MainNav } from "./main-nav";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-surface">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3 lg:flex-nowrap">
        <Brand />
        <MainNav className="order-3 flex w-full justify-center lg:order-0 lg:w-auto" />
        <div className="order-4 w-full lg:order-0 lg:min-w-0 lg:flex-1">
          <SearchBar />
        </div>
        <div className="order-2 ml-auto flex items-center gap-2 lg:order-0">
          <Button
            render={<Link href="/register" />}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Create account
          </Button>
          <UserMenu />
        </div>
      </Container>
    </header>
  );
}
