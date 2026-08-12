/**
 * The signature's "ink" reveal uses a mask-image gradient with a soft
 * trailing edge (see about-teaser.css) so it looks hand-written while it
 * animates. That trailing edge always eats the last ~6% of the box width
 * though, which permanently clips the decorative tail on the final "o" if
 * left in place — so once the wipe finishes, drop the mask entirely.
 */
export function initSignatureInk(): void {
  const signature = document.querySelector<HTMLElement>('.about-teaser__signature');
  if (!signature) return;

  signature.addEventListener(
    'transitionend',
    (event) => {
      if (event.propertyName !== '--sig-reveal') return;
      signature.style.setProperty('mask-image', 'none');
      signature.style.setProperty('-webkit-mask-image', 'none');
    },
    { once: true }
  );
}
