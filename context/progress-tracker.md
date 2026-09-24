# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- `07-wire-editor-home`: sidebar and dialogs run on the real `Project` model
  through `app/api/projects`, with a real workspace route to navigate to
  (complete)

## Current Goal

- `07-wire-editor-home` is done: `/editor` and the new `/editor/[projectId]`
  are server components that fetch owned/shared projects via
  `lib/projects.ts` and pass them into `EditorShell`. `useProjectActions`
  (replacing `useProjectDialogs`) drives create/rename/delete against the
  real `app/api/projects` routes — no more mock list, `lib/mock-projects.ts`
  is deleted. The next real product unit is the actual collaborative canvas
  (Liveblocks + React Flow) behind `EditorWorkspace`, which is currently just
  a name-only placeholder.
- Editor chrome from `02-editor` is composed into the `/editor` and
  `/editor/[projectId]` routes via `EditorShell`. The canvas region shows
  `EditorHome` (empty state) when no project is open, or `EditorWorkspace`
  (project name only, "Canvas coming soon") once one is.
- `04-project-dialogs` is done: the create/rename/delete dialog, form, and
  loading-state pattern it introduced now runs on real data (superseded by
  `07-wire-editor-home` — see above). The three dialogs still compose the
  existing `EditorDialog` shell; the sidebar lists owned/shared projects with
  rename/delete actions (owned only) via a `DropdownMenu`; mobile gets a
  tap-outside-to-close backdrop.
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

- `05-prisma`:
  - `prisma/models/project.prisma` — new multi-file schema piece (the base
    `prisma/schema.prisma` only holds the `generator`/`datasource` blocks;
    `prisma7.config.ts` points `schema` at the `prisma/` directory, which is
    what makes Prisma merge every `.prisma` file under it). Adds
    `ProjectStatus` (`DRAFT` / `ARCHIVED`), `Project` (`ownerId`, `name`,
    optional `description`, `status`, `canvasJsonPath` for the future
    Vercel Blob canvas snapshot reference per `architecture-context.md`,
    timestamps, indexes on `ownerId` and `createdAt`), and
    `ProjectCollaborator` (`projectId` with `onDelete: Cascade`, `email`,
    `createdAt`, unique on `[projectId, email]`, indexes on `email` and
    `[projectId, createdAt]`). IDs are `cuid()`.
  - `lib/prisma.ts` — cached singleton on `globalThis` (dev-only, so hot
    reload doesn't open a new pool every save). Branches on `DATABASE_URL`:
    a `prisma://` or `prisma+postgres://` prefix (both Accelerate URL
    schemes — see the PR #5 CodeRabbit fix below) uses the `accelerateUrl`
    constructor option, anything else builds a `PrismaPg`
    (`@prisma/adapter-pg`) instance and passes it as `adapter` —
    `accelerateUrl` and `adapter` are mutually exclusive on
    `PrismaClientOptions` in this Prisma version. Local dev's `DATABASE_URL`
    is the direct `postgres://...pooled.db.prisma.io...` TCP string, so it
    currently takes the adapter branch.
  - Ran `prisma migrate dev --name init_project_models` (applied against the
    Prisma Postgres dev database) then `prisma generate` — `migrate dev`
    did not auto-run `generate` in this version, so it needs to follow as
    its own step until real API routes make it part of a script.
  - Prisma 7's `prisma-client` generator (configured in `schema.prisma` with
    `output = "../app/generated/prisma"`) does not emit an `index.ts`; the
    importable entry point is `client.ts` (re-exports `PrismaClient`,
    `Prisma` namespace, model types, enums). Import as
    `@/app/generated/prisma/client`, not `@/app/generated/prisma`.
  - `/app/generated/prisma` was already in `.gitignore` from the earlier
    `prisma init`, so the generated client stays untracked.
  - Verified: `prisma validate`, `tsc --noEmit`, `eslint`, and `next build`
    all pass.

- `06-project-apis`:
  - `app/api/projects/route.ts` — `GET` lists the authenticated user's own
    projects (`where: { ownerId: userId }`, newest first); `POST` creates a
    project owned by that user, defaulting a missing/blank `name` to
    `"Untitled Project"` and returning `201`. IDs come from the schema's
    existing `cuid()` default — no sequential IDs added.
  - `app/api/projects/[projectId]/route.ts` — `PATCH` renames (400 if `name`
    is missing/blank after trimming); `DELETE` removes the project (cascades
    to `ProjectCollaborator` rows via the existing `onDelete: Cascade`). Both
    look the project up first (`404` if it doesn't exist) and compare
    `project.ownerId` to the caller's Clerk user ID (`403` if it doesn't
    match) before mutating.
  - `proxy.ts` — added `"/api(.*)"` to the public-route matcher so
    `auth.protect()` never runs against API requests. Clerk's `protect()`
    resolves unauthenticated *page* requests to a sign-in redirect, but
    unauthenticated *non-page* requests (like a plain `fetch` to `/api/...`,
    verified by reading `@clerk/nextjs`'s `protect.js`) resolve to a `404`,
    not a `401` — which would have violated this feature's `401` requirement
    before a route handler ever ran. Each route now calls `auth()` itself and
    returns `401` explicitly when `userId` is missing, giving the exact
    status codes the spec calls for. This means every future `app/api` route
    is responsible for its own auth check — the middleware no longer provides
    a protection backstop for that tree.
  - Verified: `tsc --noEmit`, `eslint`, and `next build` all pass (both
    routes show up as dynamic `ƒ` routes in the build output). Also
    smoke-tested unauthenticated requests against a real `next dev` server:
    `GET`/`POST /api/projects` and `PATCH`/`DELETE /api/projects/[id]` all
    return `401 {"error":"Unauthorized"}` with no session cookie. Did not
    verify the authenticated owner/non-owner paths end-to-end (create,
    rename, delete, `403` on a non-owner) against a real Clerk session or the
    live dev database — same sign-up/impersonation blocker noted under
    `03-auth` in Session Notes, and pulling `DATABASE_URL` out of
    `.env.local` to script a direct check was blocked by the harness as
    credential exposure. The route logic is straightforward Prisma CRUD
    type-checked against the real `Project` model, but a real authenticated
    pass is still open.
  - No UI wiring yet, per spec — wired up in `07-wire-editor-home` below.

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

- `07-wire-editor-home`:
  - `types/project.ts` — dropped `slug` (the real `Project` model has no such
    column; the sidebar only ever rendered `name`).
  - `lib/projects.ts` — new shared server-only helper, `getEditorProjects()`.
    Calls `auth()` for the Clerk `userId` and `currentUser()` for the primary
    email, then queries owned projects (`ownerId: userId`) and shared
    projects (`collaborators: { some: { email } } }`) in parallel, mapping
    both into the `Project` shape (`id`, `name`, `role`). This is the
    "project data helper" the spec calls for — it did not exist before this
    feature; it's now the single place both editor routes pull sidebar data
    from.
  - `app/editor/page.tsx` — now an async server component: calls
    `getEditorProjects()` and passes `ownedProjects` / `sharedProjects` into
    `EditorShell`. No `activeProject`, so the canvas region still shows
    `EditorHome`. No client-side fetch for the initial list, per spec.
  - `app/editor/[projectId]/page.tsx` — new route, the "workspace" that
    create navigates to. Server component: loads the project (with its
    `collaborators`) via `prisma` directly, `notFound()`s if it doesn't exist
    or the caller is neither the owner nor a collaborator (matched by email),
    otherwise renders `EditorShell` with `activeProject` set. No canvas spec
    exists yet, so the center region is `EditorWorkspace` — a deliberately
    minimal placeholder (project name + "Canvas coming soon"), not an
    invented canvas UI.
  - `hooks/use-project-actions.ts` — replaces `use-project-dialogs.ts`
    (deleted, along with `lib/mock-projects.ts`). Same dialog-state shape as
    before, but every mutation calls the real API:
    - Create: generates the room ID client-side once per dialog-open — a
      slugified-name-derived preview combined with a suffix that's fixed for
      that dialog session (`crypto.randomUUID()`, first 6 hex chars) — POSTs
      `{ name, id: roomId }`, then `router.push`es to `/editor/{id}`. The
      generated ID becomes the Prisma project row's actual `id` (see the API
      change below), so it's already aligned with the future Liveblocks room
      name with no separate mapping field needed.
    - Rename: `PATCH /api/projects/[id]`, then `router.refresh()` (re-runs
      the server component, refetching via `getEditorProjects()`).
    - Delete: `DELETE /api/projects/[id]`; if the deleted project is the
      currently open workspace (`activeProjectId`), `router.push("/editor")`,
      otherwise `router.refresh()`.
    - Added an `error` string surfaced by each dialog — the mock hook never
      failed, but real `fetch` calls can, and silently swallowing that would
      leave the dialog spinning with no feedback.
  - `app/api/projects/route.ts` — `POST` now accepts an optional client
    `id` (validated against `^[a-z0-9-]{1,64}$`, `400` if present but
    invalid) and creates the project with that ID instead of the schema's
    default `cuid()`. A `P2002` unique-constraint failure (colliding ID)
    returns `409` instead of an unhandled `500`.
  - `components/editor/editor-shell.tsx` — now takes `ownedProjects` /
    `sharedProjects` / `activeProject` as props instead of owning mock state;
    renders `EditorWorkspace` in place of `EditorHome` when `activeProject`
    is set.
  - `components/editor/editor-workspace.tsx` — new, minimal by design (see
    above).
  - `create-project-dialog.tsx` — slug preview line replaced with the room
    ID preview (`Room ID: {roomIdPreview}`); rename/delete dialogs gained an
    `error` prop rendered as inline `text-error` copy.
  - Verified: `tsc --noEmit`, `eslint`, `next build` all pass (`/editor` and
    `/editor/[projectId]` both show up as dynamic `ƒ` routes). Also
    smoke-tested against a real `next dev` server: unauthenticated `/`,
    `/editor`, and `/editor/[projectId]` all still 307-redirect to
    `/sign-in` (no regression from the new dynamic route). Using the same
    temporary-`isPublicRoute`-bypass technique documented in Session Notes
    (reverted before finishing — `git diff proxy.ts` confirmed it matches
    `06-project-apis`'s state exactly afterward): `/editor` renders
    `EditorHome` with empty owned/shared lists (no crash from `auth()` /
    `currentUser()` resolving to null server-side), `/editor/some-fake-id`
    404s via `notFound()`, and a headless-Chromium check confirmed the
    create dialog opens, the room ID preview updates live from a typed name
    (`My Cool System` → `Room ID: my-cool-system-eee07d`), and there were no
    console errors. Did not verify the authenticated golden path (create →
    navigate to `/editor/[id]` → rename → delete/redirect) against a real
    signed-in session — same Clerk Turnstile sign-up blocker noted under
    `03-auth` and `06-project-apis` in Session Notes.

- PR #5 CodeRabbit fixes (build reliability):
  - `package.json` — the generated Prisma client (`app/generated/prisma`) is
    gitignored, so a clean checkout had no client at all until someone
    manually ran `prisma generate`; `next build` failed immediately on a
    fresh clone or a clean CI/Vercel checkout. Added
    `"postinstall": "prisma generate"` (this is what actually covers a Vercel
    deployment — Vercel always runs the install step, which now regenerates
    the client automatically) and changed `"build"` to
    `"prisma generate && next build"` as a second guard for the case where
    `build` runs without a preceding fresh `install` (e.g. a cached
    `node_modules` with a stale/missing `app/generated`, as reproduced
    locally by deleting `app/generated` and running `npm run build` alone).
  - `lib/prisma.ts` — `createPrismaClient()` only recognized the
    `prisma+postgres://` Accelerate URL scheme. Prisma documents two:
    `prisma://` (classic Accelerate) and `prisma+postgres://` (Prisma
    Postgres). A `prisma://` URL was falling through to the `PrismaPg`
    driver-adapter branch, which only accepts direct `postgres://` /
    `postgresql://` connection strings and fails on Accelerate URLs. The
    `if` now checks both schemes before choosing `accelerateUrl` over the
    adapter; plain `postgres://` URLs still take the existing `PrismaPg`
    path unchanged. Kept the check as a single inlined `if` (not extracted
    into a helper function) because TypeScript's optional-chaining
    narrowing of `databaseUrl` from `string | undefined` to `string` inside
    the `if` block only works when the `?.startsWith(...)` calls are
    written directly in the condition — pulling them into a separate
    function that returns `boolean` breaks that narrowing and reintroduces
    a type error on `accelerateUrl: string | undefined`.
  - Verified end to end: deleted `app/generated/`, ran `npm install` alone
    and confirmed the `postinstall` hook regenerated it; deleted
    `app/generated/` again and ran `npm run build` alone (no preceding
    install) to confirm the `build` script's own `prisma generate` step
    also covers that path. `tsc --noEmit` and `eslint` both pass.

## In Progress

- None.

## Next Up

- Add Geist Mono (`--font-geist-mono`) alongside Geist Sans for code/mono contexts
  per `ui-context.md`.
- Build the real collaborative canvas (Liveblocks + React Flow) behind
  `EditorWorkspace`, per `architecture-context.md`'s Canvas layer — currently
  just a name-only placeholder. This is also the point to close the open
  verification gap: exercise create/rename/delete through the real UI against
  a signed-in Clerk session instead of only the unauthenticated path.

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
- Project list data flows one way: server components (`app/editor/page.tsx`,
  `app/editor/[projectId]/page.tsx`) fetch via `lib/projects.ts`'s
  `getEditorProjects()` and pass `ownedProjects` / `sharedProjects` down as
  props — no client-side fetch for the initial list. A client hook
  (`use-project-actions.ts`) owns only dialog/form state and mutations
  (create/rename/delete against `app/api/projects`); after a mutation it
  calls `router.refresh()` (or `router.push()` for create/delete-active) to
  re-run the server component rather than patching local state, so the
  props stay the single source of truth.
- A project's Prisma `id` doubles as its future Liveblocks room name — there
  is no separate room-ID column. The client generates the ID before
  creation (slugified name + a short random suffix, in
  `use-project-actions.ts`) and `POST /api/projects` accepts that ID
  (validated against `^[a-z0-9-]{1,64}$`) instead of always falling back to
  the schema's default `cuid()`. Any future Liveblocks room setup should key
  off `project.id` directly rather than introducing a new field.
- `app/editor/[projectId]` is the workspace route; it renders `EditorShell`
  with `activeProject` set, which swaps `EditorHome` for `EditorWorkspace`.
  `EditorWorkspace` is intentionally a bare placeholder (name + "coming
  soon") until a canvas feature spec exists — do not add canvas behavior
  there without a spec, per `ai-workflow-rules.md`.
- Prisma schema is split across `prisma/schema.prisma` (generator +
  datasource only) and `prisma/models/*.prisma` (one file per model group),
  merged via `prisma7.config.ts`'s `schema: "prisma/"` directory pointer.
  New models go in `prisma/models/`, not the root schema file.
- `lib/prisma.ts` is the only place that constructs `PrismaClient` — routes
  and other server code import the `prisma` singleton from there rather than
  instantiating their own client or adapter.
- `app/generated/prisma` (the Prisma Client output) is gitignored on purpose
  and must never be committed — it's regenerated by `"postinstall"` (runs on
  every `npm install`, which is what a Vercel deployment actually triggers)
  and again by `"build"` itself (`prisma generate && next build`) as a
  belt-and-suspenders guard. Both are in `package.json`; don't remove either
  without confirming a clean checkout can still produce a working build.
- `proxy.ts` treats `/api(.*)` as a public route on purpose — it is not
  actually public. `app/api` route handlers enforce their own `auth()` check
  and return `401`/`403` themselves, because Clerk's `auth.protect()` returns
  a `404` (not `401`) for unauthenticated non-page requests. Every new
  `app/api` route must call `auth()` and check `userId` itself; the
  middleware provides no auth backstop for that tree.

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
