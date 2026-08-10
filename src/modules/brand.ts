const APERTURE_PATH =
  'M 50 10 L 60.41 28.38 L 81.27 25.06 L 73.4 44.66 L 89 58.9 L 68.76 64.96 L 67.36 86.04 L 50 74 L 32.64 86.04 L 31.24 64.96 L 11 58.9 L 26.6 44.66 L 18.73 25.06 L 39.59 28.38 Z';

/**
 * "AR" lock-up echoing the brand logo: the two letters with a small
 * camera-aperture mark nested in the gap between them. A stand-in for the
 * real logo file until that artwork is available as an asset.
 */
export function brandMarkHtml(): string {
  return `
    <span class="logo-mark">
      <span class="logo-mark__text">AR</span>
      <svg class="logo-mark__aperture" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" />
        <path d="${APERTURE_PATH}" />
      </svg>
    </span>`;
}
