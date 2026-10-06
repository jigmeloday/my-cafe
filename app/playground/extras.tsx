"use client";

import * as React from "react";
import { HeartIcon, SearchIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster, toast } from "@/components/ui/toast";
import { PhoneInput } from "@/components/shared/phone-input";
import { isValidPhone } from "@/lib/phone";

const places = ["Thimphu", "Paro", "Punakha", "Bumthang", "Phuentsholing"];

export function SearchDemo() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search restaurants, clothing, events…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="default" size="sm">
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <Combobox items={places}>
        <ComboboxInput placeholder="Where? Pick a town" />
        <ComboboxContent>
          <ComboboxEmpty>No towns found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export function MenusDemo() {
  return (
    <div className="space-y-6">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Offers</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>All offers</MenubarItem>
            <MenubarItem>Deals today</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Events</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>This weekend</MenubarItem>
            <MenubarItem>Festivals</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="secondary" />}>
            Account
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuItem>Saved</DropdownMenuItem>
            <DropdownMenuItem>Following</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <HoverCard>
          <HoverCardTrigger render={<Button variant="link" />}>
            Textile house
          </HoverCardTrigger>
          <HoverCardContent>
            Hand-woven kira and gho. Norzin Lam, Thimphu.
          </HoverCardContent>
        </HoverCard>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          aria-label="Save"
        >
          <HeartIcon />
        </Button>
      </div>
    </div>
  );
}

export function DialogsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Cancel campaign
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Unspent budget stays in your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction>Cancel campaign</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet>
        <SheetTrigger render={<Button variant="secondary" />}>
          Open sheet
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down what you see.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Toaster>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Saved to your list",
              description: "Find it under Account → Saved.",
            })
          }
        >
          Show toast
        </Button>
      </Toaster>
    </div>
  );
}

export function PickersDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-2xl border bg-surface"
      />
      <Pagination className="self-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {[1, 2, 3].map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href="#" isActive={n === 2}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function PhoneDemo() {
  const [phone, setPhone] = React.useState("");
  const valid = isValidPhone(phone);

  return (
    <div className="max-w-md space-y-2">
      <PhoneInput value={phone} onChange={setPhone} invalid={!valid} />
      <p className="text-sm text-muted-foreground">
        Value: <code>{phone || "(empty)"}</code> · {valid ? "valid" : "invalid"}
      </p>
    </div>
  );
}
