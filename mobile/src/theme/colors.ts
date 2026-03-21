/**
 * App-wide color palette.
 * Import `Colors` (or the `colors` alias) wherever you need a color.
 * Never hardcode hex strings in components.
 *
 * Usage:
 *   import { Colors } from "../theme/colors";          // named constant
 *   import { Colors as colors } from "../theme/colors"; // alias (all screens)
 *   import { colors } from "../theme/colors";           // lowercase alias (App.tsx / Paper theme)
 */
export const Colors = {
  // ── Brand ──────────────────────────────────────────────
  /** Primary Tasco green — buttons, active states, highlights */
  primary: "#00A651",
  /** Light mint — header/hero background */
  primaryLight: "#EDF7ED",
  /** Secondary brand color — used for secondary Paper theme slot */
  secondary: "#6B7280",
  /** Navy used in the "Mua xe" brand circle */
  brandNavy: "#1A2B6D",
  /** Gold used in the "Mua xe" brand circle letter */
  brandGold: "#FFD700",

  // ── Text ───────────────────────────────────────────────
  /** Main body text */
  textPrimary: "#1A1A1A",
  /** Supporting text (labels, subtitles) */
  textSecondary: "#555555",
  /** Placeholder / disabled / inactive text */
  textMuted: "#9E9E9E",
  /** Text on dark/colored backgrounds */
  textOnPrimary: "#FFFFFF",

  // ── Surface ────────────────────────────────────────────
  /** Default screen background */
  background: "#FFFFFF",
  /** Card and elevated surface background */
  surface: "#FFFFFF",
  /** Progress bar track / subtle list separators */
  card: "#F2F2F2",
  /** Icon container background in service grids */
  surfaceLight: "#F2F2F2",
  /** Subtle divider and border color */
  border: "#E0E0E0",

  // ── Feedback ───────────────────────────────────────────
  success: "#00A651",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
} as const;

/** Lowercase alias — use with `import { colors } from "../theme/colors"` */
export const colors = Colors;

export type ColorKey = keyof typeof Colors;
