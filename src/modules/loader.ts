import { gsap } from 'gsap';

const SESSION_KEY = 'ar-loader-seen';

function finish(loader: HTMLElement | null): void {
  document.documentElement.classList.remove('loader-pending', 'loader-active');
  document.body.classList.remove('loader-locked');
  loader?.remove();
  window.dispatchEvent(new CustomEvent('loader:done'));
}

/**
 * Full-screen intro loader: monogram + real-feeling percentage count, then a
 * curtain reveal. Runs once per browser session (sessionStorage), so repeat
 * page visits resolve instantly via the `loader:done` event instead.
 */
export function initLoader(): void {
  const root = document.documentElement;
  const loader = document.getElementById('loader');

  if (!loader || !root.classList.contains('loader-pending')) {
    requestAnimationFrame(() => finish(loader));
    return;
  }

  root.classList.add('loader-active');
  document.body.classList.add('loader-locked');

  const mark = loader.querySelector<HTMLElement>('.loader__mark');
  const count = loader.querySelector<HTMLElement>('.loader__count');
  const percentEl = loader.querySelector<HTMLElement>('.loader__percent-value');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    sessionStorage.setItem(SESSION_KEY, '1');
    finish(loader);
    return;
  }

  const progress = { value: 0 };
  const updatePercent = () => {
    if (percentEl) percentEl.textContent = String(Math.round(progress.value));
  };

  gsap
    .timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        finish(loader);
      },
    })
    .fromTo(mark, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' })
    .to(progress, { value: 92, duration: 1.1, ease: 'power1.out', onUpdate: updatePercent }, '-=0.55')
    .to(progress, { value: 100, duration: 0.35, ease: 'power1.in', onUpdate: updatePercent })
    .to([mark, count], { opacity: 0, duration: 0.3 }, '<')
    .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=0.05');
}
