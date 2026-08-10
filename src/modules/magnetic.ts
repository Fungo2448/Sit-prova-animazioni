import { gsap } from 'gsap';

const STRENGTH = 0.35;

/** Elements marked [data-magnetic] drift toward the cursor on hover, snapping back on leave. */
export function initMagneticButtons(): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * STRENGTH);
      moveY((event.clientY - (rect.top + rect.height / 2)) * STRENGTH);
    });

    el.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}
