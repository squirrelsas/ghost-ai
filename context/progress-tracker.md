# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- `04-project-dialogs`: editor home + project create/rename/delete dialogs and
  sidebar actions wired against mock data (complete)

## Current Goal

- Editor chrome from `02-editor` is composed into the `/editor` route via
  `EditorShell`. The canvas region now shows `EditorHome` (empty-state heading
  + description + `New Project` button) until real project routing exists.
- `04-project-dialogs` is done: `useProjectDialogs` owns an in-memory mock
  project list plus create/rename/delete dialog, form, and loading state; the
  three dialogs compose the existing `EditorDialog` shell; the sidebar lists
  owned/shared projects with rename/delete actions (owned only) via a
  `DropdownMenu`; mobile gets a tap-outside-to-close backdrop. No API calls or
  persistence yet — that's the next real product unit.
- Authentication (`03-auth`) is done: every route is protected by default via
  `proxy.ts`, `/sign-in` and `/sign-up` are the only public routes, and `/`
  bounces authenticated users to `/editor`.

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

- `02-editor` (base chrome components):
  - `components/editor/editor-navbar.tsx` — client component. Fixed-height
    (`h-14`) top bar with three equal-width flex sections (left / center /
    right). Left section holds the sidebar toggle (`Button` ghost/icon) which
    swaps `PanelLeftClose` / `PanelLeftOpen` on the `isSidebarOpen` prop and
    calls `onToggleSidebar`. Center and right sections are empty placeholders.
    `bg-surface` + `border-b border-surface-border`.
  - `components/editor/project-sidebar.tsx` — client component. Floating overlay
    panel: `absolute inset-y-3 left-3 w-80 z-40`, so it layers over the canvas
    without pushing page content. Slides in from the left via a
    `translate-x` / `opacity` transition driven by the `isOpen` prop; hidden
    state also sets `pointer-events-none` + `inert`. Header with `Projects`
    title and a close button (`onClose`). shadcn `Tabs` (`My Projects` /
    `Shared`), each tab a centered empty placeholder (`FolderOpen` / `Users`
    feature icon + muted text) inside a `ScrollArea`. Full-width `New Project`
    button with `Plus` icon pinned to the bottom.
  - `components/editor/editor-dialog.tsx` — client component. Reusable dialog
    shell wrapping the shadcn `Dialog` primitives with Ghost AI tokens
    (`rounded-3xl`, `bg-elevated`, `border-surface-border`) and fixed
    `title` / `description` / `children` / `footer` slots. Controlled via
    `open` + `onOpenChange`. No concrete dialogs built yet — this is the
    pattern feature dialogs compose.
  - `components/editor/editor-shell.tsx` — client component. Full-viewport
    workspace layout that composes the chrome: owns the sidebar open state
    (`useState`), passes `isSidebarOpen` / `onToggleSidebar` to `EditorNavbar`
    and `isOpen` / `onClose` to `ProjectSidebar`. Center region is a
    placeholder for the collaborative canvas. The sidebar's positioning
    anchor is the inner `relative flex-1` region here.
  - `app/editor/page.tsx` — server component route (`/editor`) that renders
    `<EditorShell />`. First editor route in the app.
  - `EditorDialog` is intentionally not mounted yet — `02-editor` says not to
    build concrete dialogs; it stays available as the pattern.
  - Verified: `tsc --noEmit`, `eslint`, and `next build` all pass; `/editor`
    is emitted as a static route.

- `03-auth`:
  - `proxy.ts` (Next.js 16's replacement for `middleware.ts`) — `clerkMiddleware`
    with a protected-first route matcher. Public routes are read from
    `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (added to
    `.env.local` as `/sign-in` and `/sign-up`); everything else runs
    `auth.protect()`.
  - `app/layout.tsx` — wraps the app in `ClerkProvider` (inside `<body>`, per
    the installed `@clerk/nextjs` v7 API) with a shared `appearance` config.
  - `lib/clerk-appearance.ts` — Clerk's built-in `dark` theme (`@clerk/ui/themes`)
    as the base, with every `variables.*` color/typography/radius token
    remapped onto the existing Ghost AI CSS custom properties (`var(--accent-primary)`,
    `var(--bg-elevated)`, `var(--radius-2xl)`, etc.) — no hardcoded colors.
  - `components/auth/auth-layout.tsx` — shared two-panel shell for the auth
    routes: left panel (wordmark + tagline + text-only feature list) hidden
    below `lg`, right panel centers the Clerk form. No gradients, no hero,
    no cards.
  - `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`
    — Clerk catch-all routes rendering `<SignIn />` / `<SignUp />` inside
    `AuthLayout`.
  - `app/page.tsx` — now a trivial `redirect("/editor")`. Reachable only by
    authenticated users (proxy protects `/`); unauthenticated visitors are
    redirected to `/sign-in` by `auth.protect()` before the page ever renders.
  - `components/editor/editor-navbar.tsx` — right section now renders Clerk's
    `UserButton` (profile + sign-out), replacing the empty placeholder.
  - Installed `@clerk/ui` (theme package for the current Clerk SDK).
  - Verified: `tsc --noEmit`, `eslint`, and `next build` all pass. Also
    smoke-tested in a real headless-Chromium session against `next dev`:
    signed-out `/` and `/editor` both redirect to `/sign-in?redirect_url=...`,
    `/sign-in` and `/sign-up` render the two-panel dark layout with no console
    errors, and the mobile viewport (400px) correctly collapses to form-only.
    Did not verify the post-sign-in path (`/` → `/editor`, navbar `UserButton`)
    against a real authenticated session — no test credentials were available
    in this session.

- `03-auth` design pass (follow-up, from user screenshot feedback):
  - `components/auth/auth-layout.tsx` — left panel rebuilt to match an
    approved reference: `Ghost` lucide icon in a `bg-brand` mark + "GhostAI"
    wordmark, a headline/subtext pair, three icon-led feature rows (`Sparkles`
    / `Share2` / `FileText`, copy pulled from `project-overview.md`'s Features
    section), and a `© {year} Ghost AI. All rights reserved.` footer
    (`new Date().getFullYear()`, not hardcoded). Left panel background is a
    12%-accent color-mix over `--bg-surface` (`style` prop, still only
    referencing CSS custom properties — no hardcoded hex) so it reads as a
    distinct region against the near-black right panel; both panels use
    `flex-1` for an exact 50/50 split. Type scale now spans all four text
    tiers from `ui-context.md` (`text-copy-primary` headline down to
    `text-copy-faint` footer) instead of two.
  - `lib/clerk-appearance.ts` — `colorNeutral` moved from `var(--border-default)`
    to `var(--text-secondary)`: Clerk derives secondary UI (social button
    borders/hover/text shades) from this anchor, and the dark border color
    was producing washed-out gray text on the GitHub/Google buttons. Also
    added explicit `elements.socialButtonsBlockButton` /
    `socialButtonsBlockButtonText` / `socialButtonsProviderIcon` overrides so
    those buttons render at full `--text-primary` contrast regardless of the
    derived scale.
  - Verified: `tsc --noEmit`, `eslint`, `next build` all pass; re-screenshotted
    `/sign-in` at desktop and 400px mobile widths via headless Chromium — left
    panel is visibly tinted and distinct, GitHub/Google button text is bright
    white (previously dim gray), mobile still collapses to form-only.

- `04-project-dialogs`:
  - `types/project.ts` — `Project` interface (`id`, `name`, `slug`, `role: "owner" | "collaborator"`).
  - `lib/mock-projects.ts` — in-memory seed data (`MOCK_PROJECTS`), two owned +
    one collaborator project. No API calls or persistence, per the spec.
  - `lib/slug.ts` — `slugify()`, a small pure function used by both the create
    dialog's live preview and project creation/rename.
  - `hooks/use-project-dialogs.ts` — the "dedicated hook" the spec calls for.
    Owns the mock project list (derives `ownedProjects` / `sharedProjects` by
    `role`), the create/rename/delete dialog state (a discriminated union so
    the open dialog always carries the project it targets), the shared `name`
    form field + `slugPreview`, and `isSubmitting`. Create/rename/delete are
    `async` and await a fixed `MOCK_LATENCY_MS` (400ms) `setTimeout` before
    mutating state — there's no real request yet, but this keeps the loading
    state real (buttons actually disable and show "…" text) instead of a
    boolean that's never true, so wiring a real API in later won't change the
    calling shape.
  - `components/editor/create-project-dialog.tsx`,
    `rename-project-dialog.tsx`, `delete-project-dialog.tsx` — each a thin
    wrapper around `EditorDialog`. Create/rename use a `<form>` with a matching
    `id` and a footer `Button` with `form="..."` (submits via that attribute
    and via Enter in the input); delete has no input, its footer button is
    `variant="destructive"`.
  - `components/editor/editor-home.tsx` — the `/editor` empty-state content
    (heading, description, `New Project` button), rendered in the canvas
    region by `EditorShell` in place of the old "Canvas coming soon" text.
  - `components/editor/project-sidebar.tsx` — now takes `ownedProjects` /
    `sharedProjects` plus the three dialog-open callbacks instead of rendering
    static tab placeholders. Added a `ProjectList` helper that renders rows or
    falls back to the existing `EmptyState`; each owned row has a
    hover-revealed (`group-hover`/`focus-visible`/`data-[state=open]`) kebab
    button opening a shadcn `DropdownMenu` (`Rename` / destructive `Delete`);
    shared rows render with no actions at all, per spec. Added a
    `lg:hidden` full-bleed backdrop button (`absolute inset-0`, same
    positioning ancestor as the `aside`) that closes the sidebar on tap —
    desktop is unaffected since the sidebar was already a non-blocking floating
    overlay there.
  - `components/editor/editor-shell.tsx` — now calls `useProjectDialogs()` and
    wires everything: sidebar callbacks, `EditorHome`'s button, and the three
    dialog components (each dialog's `open` is derived from
    `dialog?.type === "..."`, matching the discriminated union).
  - Added the shadcn `dropdown-menu` component (`npx shadcn@latest add
    dropdown-menu`) — generated file left unmodified, same convention as the
    rest of `components/ui/*`.
  - Verified: `tsc --noEmit`, `eslint`, and `next build` all pass. Also
    smoke-tested against a real `next dev` server with headless Chromium
    (Playwright, installed to the session scratchpad only — not added to the
    repo): editor home renders, sidebar opens with both tabs populated from
    mock data, hovering an owned row reveals the kebab menu and both dropdown
    items, rename dialog shows prefilled+auto-focused+selected text, delete
    dialog's confirm button is destructive-red, the create dialog's slug
    preview updates live (`My Cool System` → `/my-cool-system`), submitting
    create actually appends the project to the sidebar list, and at 400px
    width opening the sidebar shows the mobile backdrop and tapping outside
    the panel closes it. No console errors during the run.

- `04-project-dialogs` accessibility fixes (CodeRabbit follow-up):
  - `components/editor/project-sidebar.tsx` — the row kebab button was hidden
    (`opacity-0`) until `group-hover`, which is unreachable on touch devices
    (no hover state to trigger the reveal). Now gated with the `pointer-fine:`
    variant: visible by default, and only hidden-until-hover on devices that
    actually have a fine pointer (mouse/trackpad) — touch and other coarse
    pointers always see the button. `focus-visible:` and
    `data-[state=open]:` keep working unconditionally.
  - `components/editor/rename-project-dialog.tsx` — the rename `Input` had no
    accessible name (no `<label>`, `placeholder`, or `aria-label`). Added
    `aria-label="Project name"`.
  - Verified: `tsc --noEmit`, `eslint`, `next build` all pass.

## In Progress

- None.

## Next Up

- Add Geist Mono (`--font-geist-mono`) alongside Geist Sans for code/mono contexts
  per `ui-context.md`.
- Begin the next real product unit: persist projects for real (Prisma +
  `app/api` routes) behind the create/rename/delete dialogs built in
  `04-project-dialogs`, replacing `useProjectDialogs`'s mock list and
  artificial latency with actual requests — or canvas scaffolding.

## Open Questions

- None.

## Architecture Decisions

- UI layer uses shadcn/ui (Radix primitives) via the `radix-nova` registry style;
  `components/ui/*` are treated as generated foundation files and are not edited directly.
- Tailwind-class merging goes through `cn()` from `@/lib/utils`.
- Theme is dark-only: one palette on `:root`, no light mode. The `dark` class on `<html>`
  exists solely to enable shadcn's `dark:` utility variant. shadcn semantic tokens are
  aliased to the Ghost AI palette rather than carrying their own values.
- Auth uses Clerk's `dark` theme (`@clerk/ui/themes`) as the appearance base, not the
  `shadcn` theme, even though the project has shadcn/ui installed — `03-auth.md`
  explicitly calls for the `dark` theme with variables remapped onto the app's own
  CSS custom properties. Route protection is protected-first (`proxy.ts` blocks
  everything not matched by `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `_SIGN_UP_URL`), and
  `/` relies on that protection rather than checking `auth()` itself — it is only
  ever reached by an authenticated request, so it just redirects to `/editor`.
- For a not-yet-persisted feature, the dedicated hook (e.g.
  `use-project-dialogs.ts`) is the integration point for real persistence, not
  the seed data file. The hook owns the live state and every mutation
  (`setProjects` on create/rename/delete); `lib/mock-projects.ts` only supplies
  the initial value passed to `useState`, typed against a `types/*.ts`
  interface. Wiring in `app/api` means rewriting the hook's mutations to call
  those routes instead of mutating local state — `mock-projects.ts` itself
  just gets deleted at that point.

## Session Notes

- shadcn CLI in use is v4.x, which requires a preset; `nova` (Lucide / Geist) was chosen
  to match the stack in `ui-context.md`. Re-run adds with `npx shadcn@latest add <name>`.
- App/feature components must use the Ghost AI Tailwind tokens (`bg-base`, `text-brand`,
  …) — no raw `zinc-*` classes or hex values (see `code-standards.md`).
- Verifying a protected route (anything under `/editor`) in a browser needs a
  signed-in Clerk session, and this dev instance has Cloudflare Turnstile bot
  protection on sign-up, which blocks headless-Chromium sign-up outright (the
  `+clerk_test@example.com` / `424242` test-mode bypass never gets a chance to
  run — Turnstile's checkbox blocks the form first). Neither `clerk auth login`
  nor `clerk impersonate` are usable either, since the CLI isn't logged in in
  this environment and that requires an interactive browser OAuth flow. The
  workaround used here: temporarily add the route being tested to `proxy.ts`'s
  `isPublicRoute` matcher, run the browser check, then revert `proxy.ts` back
  to its exact original content before finishing. Only do this for local
  verification in a session — never leave the bypass in place.
- Playwright (not a project dependency) is a workable headless-Chromium driver
  on this Windows/Git-Bash host when UI verification is needed: install it
  into a throwaway `npm init`'d folder under the session scratchpad
  (`npm install playwright@<version>`, browsers download to the shared
  `%LOCALAPPDATA%/ms-playwright` cache so repeat installs are instant), then
  drive `next dev` from a plain Node script with `require("playwright")`.
  Keeps the repo's own `package.json` untouched.
