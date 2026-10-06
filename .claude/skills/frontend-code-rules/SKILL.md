---
name: frontend-code-rules
description: Code-organization rules for all frontend code in this app — no repeated logic, small single-purpose files, 150-line component limit, types/constants/utils/hooks kept in separate files, and the per-page colocated folder layout (components, constant, model, utils, hooks). Use whenever writing or editing any page, component, hook, util, type, or constant.
---

# Frontend Code Rules

Applies to every page and component. Visual rules are in `ui-guidelines`; project-wide layout is in `folder-structure`.

## The rules
1. **Don't repeat yourself.** Before writing a function, search for an existing one (`utils/`, `hooks/`, `lib/`). A second copy of anything means it should become shared.
2. **Keep everything separate and short.** One responsibility per file, one main export per file, small functions that do one thing. If you need "and" to describe a file, split it.
3. **Repeated logic → shared function or custom hook.**
   - Pure logic (formatting, mapping, calculations) → a util function.
   - Logic using React state/effects/context (debounce, pagination, form state, media queries, fetching UI state) → a custom hook `use-*.ts`.
   - Repeated markup → a shared component (see `ui-guidelines`).
   - Used by one page only → put it in that page's `utils/` or `hooks/`; used by 2+ features → promote to `src/utils`/`src/lib` or `src/hooks`.
4. **Max 150 lines per component/page file** (hard limit; aim well under). Over that → split into sub-components, move logic into a hook, and move data/config into constants.
5. **Never mix concerns in a component or page file.** No `type`/`interface`, constants/config arrays, helper functions, or schemas defined inside a `.tsx` component/page:
   - types & interfaces → `model/<name>.type.ts`
   - constants, static data, option lists, labels, class maps → `constant/<name>.constant.ts`
   - helper/pure functions → `utils/<name>.utils.ts`
   - stateful logic → `hooks/use-<name>.ts`
   - Zod schemas → `lib/validations/<name>.schema.ts`
   A component file contains the component (and tiny inline JSX only) — nothing else.
6. **Pages stay thin.** `page.tsx` composes components and passes data; it does no formatting, mapping, or business logic, and renders no big JSX blocks itself.
7. **No magic values.** Strings, numbers, routes, limits, and option lists live in `constant/` (shared ones in `src/lib/constants.ts`). No hard-coded colors (use tokens).
8. **Naming:** files `kebab-case`; components `PascalCase`; hooks `useX`; constants `UPPER_SNAKE_CASE`; types `PascalCase`. Suffixes: `.constant.ts`, `.type.ts`, `.utils.ts`.
9. **Types:** no `any`; derive types from Prisma/Zod (`z.infer`) instead of rewriting them; props types come from `model/`, not inline in the component.
10. **Imports:** use the `@/` alias; import from the file that owns the thing (no pass-through barrel files unless they already exist); no circular imports.

## Per-page folder layout (colocated)
Each page/feature keeps its own parts next to `page.tsx`:

```
home/
├── page.tsx                      # thin: composes components
├── components/
│   ├── hero.tsx                  # each ≤150 lines
│   ├── search-form.tsx
│   └── offer-list.tsx
├── constant/
│   └── home.constant.ts          # static data, options, labels
├── model/
│   └── home.type.ts              # types & interfaces
├── utils/
│   └── home.utils.ts             # pure helper functions
└── hooks/
    └── use-home-filters.ts       # only if stateful logic exists
```
Create only the folders/files the page actually needs. Shared pieces live in `src/components/shared`, `src/hooks`, `src/utils` (or `src/lib`).

## Example of the split
```ts
// constant/home.constant.ts
export const HOME_TABS = ["Deals", "Events", "New"] as const;
// model/home.type.ts
import type { HOME_TABS } from "../constant/home.constant";
export type HomeTab = (typeof HOME_TABS)[number];
// utils/home.utils.ts
import type { HomeTab } from "../model/home.type";
export const isHomeTab = (v: string): v is HomeTab => (HOME_TABS as readonly string[]).includes(v);
```
```tsx
// components/search-form.tsx — only the component
import { HOME_TABS } from "../constant/home.constant";
export function SearchForm() { /* JSX only, < 150 lines */ }
```

## Before finishing a change
- Any file over 150 lines? Split it.
- Any type/constant/helper inside a `.tsx`? Move it out.
- Same code in two places? Extract a util/hook/shared component.
- New shared component? Add it to `/playground`.
