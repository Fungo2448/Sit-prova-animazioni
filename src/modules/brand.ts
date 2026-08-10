/**
 * "AR" brand mark — the real logo artwork (public/brand-logo-icon.png),
 * trimmed to a transparent PNG. Rendered as an <img>; theme-adaptive
 * color (dark ink on light backgrounds, cream on dark ones) is handled
 * in CSS via a filter: invert() toggle, since a raster image can't pick
 * up `currentColor` the way text/SVG-stroke marks can.
 */
export function brandMarkHtml(): string {
  return `<img class="logo-mark" src="/brand-logo-icon.png" alt="Alessandra Romeo" width="620" height="620" />`;
}
