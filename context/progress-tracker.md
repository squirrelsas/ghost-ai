# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation: design system and UI primitives

## Current Goal

- Foundation UI is in place (shadcn/ui primitives + dark-only Ghost AI theme).
  Ready to start the next feature unit.

## Completed

- `01-design-system`:
  - Installed and configured shadcn/ui (`components.json`, style `radix-nova`, RSC, lucide
    icon library, `@/*` aliases). Init also wired the Geist Sans font in `app/layout.tsx`
    and the shadcn base layers in `app/globals.css`.
  - Added UI primitives under `components/ui/`: `button`, `card`, `dialog`, `input`,
    `tabs`, `textarea`, `scroll-area`. Generated files left unmodified.
  - Installed `lucide-react`.
  - `lib/utils.ts` exposes the reusable `cn()` Tailwind-class merge helper (shadcn's
    first-party `cn` package, a drop-in for `clsx` + `tailwind-merge`).

- Theme tokens (follow-up to `01-design-system`):
  - Replaced the default shadcn light/dark palette in `app/globals.css` with the
    dark-only Ghost AI token system from `ui-context.md`: raw palette variables
    (`--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--border-default`,
    `--border-subtle`, `--text-primary/secondary/muted/faint`, `--accent-primary`,
    `--accent-primary-dim`, `--accent-ai`, `--accent-ai-text`, `--state-error/success/
    warning`) on a single `:root`, plus `@theme inline` mappings to Tailwind utilities
    (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`,
    `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, `text-error`, …).
  - The shadcn semantic tokens (`--background`, `--foreground`, `--primary`, `--card`,
    `--border`, `--ring`, `--muted`, `--destructive`, `--sidebar-*`, `--chart-*`) are
    kept but re-expressed in terms of the Ghost AI palette so the generated
    `components/ui/*` files render correctly without edits.
  - Added `dark` to the `<html>` class list in `app/layout.tsx` so the `dark:` utility
    variant used by the generated components is active.
  - Verified: `tsc --noEmit`, `eslint`, and `next build` all pass; built CSS emits the
    `--bg-base` custom property and `bg-base` / `text-brand` / `text-copy-primary`
    utilities.

## In Progress

- None.

## Next Up

- Add Geist Mono (`--font-geist-mono`) alongside Geist Sans for code/mono contexts
  per `ui-context.md`.
- Begin the next product feature unit (auth + projects, or canvas scaffolding).

## Open Questions

- None.

## Architecture Decisions

- UI layer uses shadcn/ui (Radix primitives) via the `radix-nova` registry style;
  `components/ui/*` are treated as generated foundation files and are not edited directly.
- Tailwind-class merging goes through `cn()` from `@/lib/utils`.
- Theme is dark-only: one palette on `:root`, no light mode. The `dark` class on `<html>`
  exists solely to enable shadcn's `dark:` utility variant. shadcn semantic tokens are
  aliased to the Ghost AI palette rather than carrying their own values.

## Session Notes

- shadcn CLI in use is v4.x, which requires a preset; `nova` (Lucide / Geist) was chosen
  to match the stack in `ui-context.md`. Re-run adds with `npx shadcn@latest add <name>`.
- App/feature components must use the Ghost AI Tailwind tokens (`bg-base`, `text-brand`,
  …) — no raw `zinc-*` classes or hex values (see `code-standards.md`).
