import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Reveal } from "@/components/shared/reveal";
import { DialogsDemo, MenusDemo, PickersDemo, SearchDemo } from "./extras";

const colors = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "primary", className: "bg-primary" },
  { name: "maroon-dark", className: "bg-maroon-dark" },
  { name: "maroon-soft", className: "bg-maroon-soft" },
  { name: "gold", className: "bg-gold" },
  { name: "success", className: "bg-success" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "muted", className: "bg-muted" },
  { name: "border", className: "bg-border" },
  { name: "destructive", className: "bg-destructive" },
] as const;

const variants = [
  "default",
  "secondary",
  "outline",
  "soft",
  "ghost",
  "destructive",
  "link",
] as const;

const nav = [
  ["colors", "Colors"],
  ["typography", "Typography"],
  ["buttons", "Buttons"],
  ["variants", "Variants"],
  ["forms", "Forms"],
  ["cards", "Cards"],
  ["overlays", "Overlays"],
  ["search", "Search"],
  ["menus", "Menus"],
  ["dialogs", "Dialogs"],
  ["pickers", "Pickers"],
  ["tabs", "Tabs"],
] as const;

const sizes = ["xs", "sm", "default", "lg"] as const;

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-28 space-y-5">
        <h2 className="flex items-baseline gap-3">
          <span className="text-sm font-semibold text-primary">{index}</span>
          {title}
        </h2>
        <div className="rounded-3xl bg-card p-5 shadow-sm ring-1 ring-black/5 sm:p-8">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

export default function PlaygroundPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-primary">
            Playground
          </span>
          <nav className="-mx-1 flex flex-1 snap-x gap-2 overflow-x-auto px-1">
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="shrink-0 snap-start rounded-full border bg-surface px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-10 sm:space-y-16 sm:px-6 sm:py-14">
        <header className="space-y-2">
          <h1>Design playground</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Every shared component style in one place. Add new components here
            as they are built.
          </p>
        </header>

        <Section id="colors" index="01" title="Colors">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {colors.map((c) => (
              <div key={c.name} className="space-y-2">
                <div className={`h-16 rounded-xl border ${c.className}`} />
                <p className="text-xs font-medium">{c.name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="typography" index="02" title="Typography">
          <div className="space-y-6">
            <h1>Heading 1 — Discover what&apos;s happening</h1>
            <h2>Heading 2 — Featured this week</h2>
            <h3>Heading 3 — Latest offers</h3>
            <h4>Heading 4 — New in town</h4>
            <h5>Heading 5 — Upcoming events</h5>
            <h6>Heading 6 — Local businesses</h6>
            <div className="space-y-2 border-t pt-6">
              <p>
                Body text. Deals, events and new arrivals from shops, cafés and
                services near you.
              </p>
              <p className="text-sm text-muted-foreground">
                Secondary text. Valid in store until 20 October.
              </p>
              <p className="text-xs text-muted-foreground">
                Caption. Restaurant · Norzin Lam
              </p>
            </div>
          </div>
        </Section>

        <Section id="buttons" index="03" title="Buttons & links">
          <div className="overflow-x-auto">
            <div className="grid min-w-[34rem] grid-cols-[6rem_repeat(3,1fr)] items-center gap-x-4 gap-y-5">
              <span />
              <Label>Default</Label>
              <Label>Hover (use mouse)</Label>
              <Label>Disabled</Label>

              <span className="text-sm font-semibold">Primary</span>
              <div>
                <Button>Search</Button>
              </div>
              <div>
                <Button>Search</Button>
              </div>
              <div>
                <Button disabled>Search</Button>
              </div>

              <span className="text-sm font-semibold">Secondary</span>
              <div>
                <Button variant="secondary">How it works</Button>
              </div>
              <div>
                <Button variant="secondary">How it works</Button>
              </div>
              <div>
                <Button variant="secondary" disabled>
                  How it works
                </Button>
              </div>

              <span className="text-sm font-semibold">Small</span>
              <div>
                <Button variant="secondary" size="sm">
                  Follow
                </Button>
              </div>
              <div>
                <Button variant="soft" size="sm">
                  Following
                </Button>
              </div>
              <div>
                <Button variant="link">View all offers</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="variants" index="04" title="All variants × sizes">
          <div className="space-y-6">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <Label>{variant}</Label>
                <div className="flex flex-wrap items-center gap-3">
                  {sizes.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      {size}
                    </Button>
                  ))}
                  <Button variant={variant} disabled>
                    disabled
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="forms" index="05" title="Form controls">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Input placeholder="What are you looking for?" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Invalid" aria-invalid />
              <Textarea placeholder="Tell people about your offer" />
              <Select defaultValue="thimphu">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thimphu">Thimphu</SelectItem>
                  <SelectItem value="paro">Paro</SelectItem>
                  <SelectItem value="punakha">Punakha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox defaultChecked /> Verified businesses only
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox /> Free delivery
              </label>
              <RadioGroup defaultValue="week" className="gap-3">
                <label className="flex items-center gap-3 text-sm">
                  <RadioGroupItem value="today" /> Today
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <RadioGroupItem value="week" /> This week
                </label>
              </RadioGroup>
              <label className="flex items-center gap-3 text-sm">
                <Switch defaultChecked /> Notifications
              </label>
              <Slider defaultValue={[40]} max={100} />
            </div>
          </div>
        </Section>

        <Section id="cards" index="06" title="Cards & loading">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>20% off hand-woven kira</CardTitle>
                <CardDescription>Textile house · Norzin Lam</CardDescription>
              </CardHeader>
              <CardContent>Valid in store until 20 October.</CardContent>
              <CardFooter>
                <Button size="sm">View offer</Button>
              </CardFooter>
            </Card>
            <div className="space-y-3">
              <Skeleton className="aspect-4/3 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </Section>

        <Section id="overlays" index="07" title="Overlays & accordion">
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger render={<Button variant="secondary" />}>
                  Open dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Launch campaign?</DialogTitle>
                    <DialogDescription>
                      You will be charged per click, up to your budget.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Launch</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger render={<Button variant="secondary" />}>
                  Open popover
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Sponsored</PopoverTitle>
                    <PopoverDescription>
                      This business paid to promote this offer.
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" />}>
                  Hover me
                </TooltipTrigger>
                <TooltipContent>Saved to your list</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <Accordion className="mt-6">
            <AccordionItem value="a">
              <AccordionTrigger>How does pricing work?</AccordionTrigger>
              <AccordionContent>
                You pay only for valid clicks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Can I pause a campaign?</AccordionTrigger>
              <AccordionContent>Yes, at any time.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section id="search" index="08" title="Search & combobox">
          <SearchDemo />
        </Section>

        <Section id="menus" index="09" title="Menus & hover">
          <MenusDemo />
        </Section>

        <Section id="dialogs" index="10" title="Alert, sheet & toast">
          <DialogsDemo />
        </Section>

        <Section id="pickers" index="11" title="Calendar & pagination">
          <PickersDemo />
        </Section>

        <Section id="tabs" index="12" title="Tabs">
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              Offers and events on right now.
            </TabsContent>
            <TabsContent value="upcoming">Starting soon.</TabsContent>
            <TabsContent value="past">Ended offers and events.</TabsContent>
          </Tabs>
        </Section>
      </main>
    </>
  );
}
