import type { Appearance } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";

/**
 * Clerk's dark theme, remapped onto the Ghost AI CSS custom properties
 * (see context/ui-context.md) so auth UI matches the app palette without
 * hardcoding any colors.
 */
export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    // A light anchor, not `--border-default` — Clerk derives secondary UI
    // (social button borders/text, hover states) as shades off this value,
    // and a dark anchor here was what made the social buttons look washed out.
    colorNeutral: "var(--text-secondary)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-muted)",
    colorMuted: "var(--bg-subtle)",
    colorBackground: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorInput: "var(--bg-surface)",
    colorShimmer: "var(--bg-subtle)",
    colorRing: "var(--accent-primary)",
    colorBorder: "var(--border-default)",
    colorModalBackdrop: "color-mix(in srgb, var(--bg-base) 80%, transparent)",
    colorShadow: "color-mix(in srgb, var(--bg-base) 60%, transparent)",
    fontFamily: "var(--font-sans)",
    borderRadius: "var(--radius-2xl)",
  },
  elements: {
    // Force full-contrast text/icons on the Google/GitHub buttons instead of
    // relying on the derived neutral scale, which still read as dim.
    socialButtonsBlockButton: {
      borderColor: "var(--border-subtle)",
      backgroundColor: "var(--bg-surface)",
    },
    socialButtonsBlockButtonText: {
      color: "var(--text-primary)",
      fontWeight: 500,
    },
    socialButtonsProviderIcon: {
      opacity: 1,
    },
  },
};
