---
name: ui-guidelines
description: UI rules for building pages and components in this app — reuse existing components, extract shared components when patterns repeat, Airbnb-style visual design, Framer Motion animation, mandatory responsive layouts, accessibility, and the playground. Use whenever creating or editing any UI, page, component, or styling.
---

# UI Guidelines

Applies to every page and component. Code-organization rules (150-line limit, separate types/constants/utils/hooks) are in `frontend-code-rules`. Colors/tokens come from `app/globals.css`; product tone and palette rules are in `discovery-marketplace`; file placement is in `folder-structure`.

## 1. Reuse first
- Before writing any markup, check `components/ui/` (shadcn primitives), `components/shared/`, and the area folder (`components/public/`, `business/`, `admin/`, `account/`). Use what exists.
- Need a button, input, card, badge, dialog, table? Use the existing one (or `npx shadcn add <name>`) — never hand-roll a lookalike.
- Extend an existing component with a variant/prop (cva) instead of copying it with small differences. Check the `Button` variants (`default`, `secondary`, `outline`, `soft`, `ghost`, `destructive`, `link`) before adding one.
- Never hard-code colors (`#7f1d3a`, `bg-red-500`, `zinc-*`). Use tokens: `bg-primary`, `bg-maroon-dark`, `bg-maroon-soft`, `bg-gold`, `text-success`, `bg-surface`, `text-muted-foreground`, `border-border`, etc.

## 2. Extract when it repeats
- Same markup/pattern appears a **second time** in a different place → move it to a shared component. Used in one area only → that area's folder (`components/public/promotion-card.tsx`); used across areas → `components/shared/`.
- Don't extract speculatively for a single use. Don't create components that are only a pass-through wrapper.
- Shared components take typed props, accept `className` (merged with `cn`), and have no data fetching or business logic.
- Every new shared/ui component gets a section on `/playground` (`app/playground/page.tsx`) showing its variants, sizes, and states.

## 3. Airbnb-style design
Visual, calm, content-first, generous whitespace.
- **Imagery leads.** Cards are image-first: large rounded image (aspect 4/3 or 1/1, `rounded-xl`/`rounded-2xl`), then 2–3 lines of text beneath — title, one muted meta line, one key fact (price/discount/date). Cards are mostly borderless on the cream background; use a subtle border or soft shadow only where needed.
- **Rounded & soft:** large radii (`rounded-xl`–`rounded-3xl`), pill-shaped chips/filters, light shadows (`shadow-sm`, `hover:shadow-md`), never heavy borders or gradients.
- **Whitespace:** generous section spacing (`py-10`–`py-16`), consistent 4/8px rhythm, content in `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8`.
- **Typography:** clear hierarchy — tight semibold headings, regular readable body, muted secondary text. Few font sizes/weights. Sentence case, short plain copy.
  - **Headings (`h1`–`h6`) are styled globally in `app/globals.css`** (responsive size, weight, tracking, leading). Use the semantic tag and give it **no size or font classes** — no `text-3xl`, `font-bold`, `tracking-tight`, `leading-*` on headings. Pick the tag by document hierarchy (one `h1` per page, no skipped levels), not by how big you want it. If a heading needs a different look, change `globals.css` so every page stays consistent; only layout/color/spacing classes (`mt-*`, `text-primary`, `flex`) are acceptable on a heading.
  - Same principle for body text: don't set the font family or a base size on components — the font (Figtree) and base text size come from `globals.css`. Use size utilities (`text-sm`, `text-xs`) only for deliberate secondary text such as captions and meta lines, never to restyle headings.
- **Browsing patterns:** horizontal category/filter chip row, card grids and carousels, sticky search bar, "Show more" / "View all" links. Save/follow as a small heart/icon button over the image corner.
- **One primary action per view** in maroon; everything else secondary/ghost. Gold only as a small accent (Sponsored/Featured). Paid placements always carry a visible "Sponsored" label.
- Icons: `lucide-react`, consistent size (`size-4`/`size-5`) and stroke.
- Dashboards (business/admin) may be denser and more functional but keep the same tokens, radii, and components.

## 4. Motion (Framer Motion)
Use `framer-motion` (`import { motion, AnimatePresence } from "framer-motion"`) to make UI feel smooth. Components using it need `"use client"`.
- Subtle and fast: 150–300ms, ease-out (or a soft spring). Animate `opacity`, `transform` (`x`, `y`, `scale`) — not `width/height/top/left`.
- Good uses: card hover lift (`whileHover={{ y: -4 }}`), button/icon press (`whileTap={{ scale: 0.97 }}`), fade/slide-in on mount, staggered grid entrance, modal/dropdown/sheet enter-exit with `AnimatePresence`, layout transitions (`layout`) for filter/sort changes, tab indicator (`layoutId`).
- Scroll reveals: `whileInView` with `viewport={{ once: true }}`; don't re-animate on every scroll.
- Respect reduced motion: wrap the app/section in `<MotionConfig reducedMotion="user">` (or use `useReducedMotion`).
- Keep variants/transition presets in one shared place (e.g. `lib/motion.ts`) and reuse them; don't re-declare the same animation in every component.
- Don't animate everything. No looping/attention-grabbing animations, nothing that delays access to content or blocks interaction. Prefer Server Components for static content; isolate motion in small client components so pages stay mostly server-rendered.

## 5. Responsive (always)
- **Mobile-first**: write base styles for phones, add `sm:` `md:` `lg:` `xl:` upwards. Every page/component must be checked at ~375px, ~768px, ~1280px.
- Grids collapse: e.g. `grid-cols-1 sm:grid-cols-2 lg:3 xl:4`. Horizontal chip/card rows scroll on mobile (`overflow-x-auto`, snap) instead of wrapping awkwardly.
- No horizontal page scroll; no fixed pixel widths on containers — use `w-full`, `max-w-*`, `min-w-0`, `aspect-*`.
- Navigation: collapsed menu/sheet on mobile, full nav on desktop. Dashboards: sidebar becomes a drawer on mobile; tables become stacked cards or scroll within their own container.
- Touch targets ≥ 40px; readable text ≥ 14px; don't rely on hover for essential actions (hover is an enhancement).
- Use `next/image` with `sizes` and `fill`/`aspect-*` so images are responsive and don't shift layout.

## 6. Other best practices
- **Accessibility:** semantic elements (`button`, `nav`, `main`, `section`, headings in order), visible focus rings (already in tokens), `aria-label` on icon-only buttons, `alt` on images, sufficient contrast (maroon on cream/white passes; don't put gold text on white), keyboard-operable dialogs/menus (use Base UI/shadcn primitives).
- **States:** every data-driven view has loading (skeleton, not spinner-only), empty (`EmptyState` with a next action), and error states. Buttons show pending state during server actions (`disabled` + indicator).
- **Forms:** React Hook Form + Zod schema from `lib/validations/`, inline field errors, labels always visible, correct `type`/`autocomplete`.
- **Server vs client:** default to Server Components; add `"use client"` only for state, effects, event handlers, or Framer Motion, and keep those components small and leaf-level.
- **Performance:** `next/image`, `next/link`, lazy-load below-the-fold media, avoid large client bundles, no layout shift.
- **Styling:** Tailwind utilities with `cn()`; variants via `cva`; no inline `style` for things Tailwind covers; no `!important`; light theme only (no `dark:` classes).
- **Money/dates/numbers** display only through `lib/formatters/*`.
- **Copy:** plain, local, useful — see Voice in `discovery-marketplace`.
- **Verify:** add/update the component on `/playground`, then view it at mobile and desktop widths before calling UI work done.
