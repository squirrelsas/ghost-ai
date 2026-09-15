import { Ghost, Share2, Sparkles, FileText } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

/**
 * Shared shell for the sign-in and sign-up routes. Two equal-width panels on
 * large screens (brand + feature list, centered Clerk form); form only on
 * small screens. The left panel carries a subtle brand-tinted background so
 * it reads as a distinct region rather than a second copy of the page bg.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-1">
      <div
        className="hidden flex-1 flex-col justify-between border-r border-surface-border px-16 py-16 lg:flex"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-surface) 88%, var(--accent-primary) 12%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand">
            <Ghost className="h-5 w-5 text-copy-primary" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-copy-primary">
            GhostAI
          </span>
        </div>

        <div className="max-w-md space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="text-base text-copy-secondary">
              Describe your architecture in plain English. Ghost AI maps it to
              a shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim">
                  <Icon className="h-4 w-4 text-brand" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-copy-primary">{title}</p>
                  <p className="text-sm text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
