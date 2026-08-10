import { gsap } from 'gsap';

/** Thin difference-blend ring cursor; enlarges over links/buttons. Desktop pointer only. */
export function initCustomCursor(): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-fx';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
  });

  document.addEventListener('mouseover', (event) => {
    const isInteractive = (event.target as HTMLElement).closest('a, button, [data-cursor-hover]');
    cursor.classList.toggle('is-active', Boolean(isInteractive));
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
}
