const STAGGER_STEP_MS = 90;

function applyGroupStagger(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(':scope > [data-reveal]');
    items.forEach((item, index) => {
      if (!item.dataset.revealDelay) {
        item.dataset.revealDelay = String(index * STAGGER_STEP_MS);
      }
    });
  });
}

function revealAll(targets: NodeListOf<HTMLElement>): void {
  targets.forEach((el) => el.classList.add('is-visible'));
}

function observeTargets(targets: NodeListOf<HTMLElement>): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

function start(): void {
  document.documentElement.classList.add('reveal-ready');
  applyGroupStagger();

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll(targets);
    return;
  }

  observeTargets(targets);
}

/** Fades/slides elements marked [data-reveal] into view as they enter the viewport. */
export function initRevealAnimations(): void {
  if (document.documentElement.classList.contains('loader-active')) {
    window.addEventListener('loader:done', start, { once: true });
  } else {
    start();
  }
}
