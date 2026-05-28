/**
 * Presentation mode — shared types & helpers.
 *
 * Activated when the URL contains `?mode=present` or `?present=1`.
 * The controller sets `data-present` on <body> and shows one
 * `[data-present-section]` slide at a time (PPT-style deck). Normal
 * page content outside slides is hidden via presentation.css.
 */

export type PresentEffect =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "zoom";

export const PRESENT_QUERY_KEYS = ["mode", "present"] as const;

/**
 * Detect presentation mode from a URL search string.
 * Safe to call in SSR (returns false if `window` is undefined).
 */
export function isPresentModeFromSearch(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get("mode") === "present" || params.get("present") === "1";
}

/** True on the dedicated deck page (/present/). */
export function isPresentDeckPage(pathname?: string): boolean {
  const path =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "");
  return /\/present\/?$/.test(path);
}

export function isPresentMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isPresentModeFromSearch(window.location.search) ||
    isPresentDeckPage() ||
    document.body?.dataset.present === "true"
  );
}
