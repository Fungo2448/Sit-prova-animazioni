import { gsap } from 'gsap';

const INTERVAL_MS = 6000;

export function initTestimonialSlider(): void {
  const root = document.querySelector<HTMLElement>('[data-testimonial-slider]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>('.testimonial__slide'));
  if (slides.length <= 1) return;

  const dots = Array.from(root.querySelectorAll<HTMLElement>('.testimonial__dot'));
  let activeIndex = 0;
  let timer: number;

  const goTo = (index: number) => {
    const next = slides[index];
    const current = slides[activeIndex];
    if (next === current) return;

    gsap.to(current, { opacity: 0, duration: 0.5, ease: 'power1.out' });
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', delay: 0.15 });

    dots[activeIndex]?.classList.remove('is-active');
    dots[index]?.classList.add('is-active');
    activeIndex = index;
  };

  const advance = () => goTo((activeIndex + 1) % slides.length);

  const start = () => {
    timer = window.setInterval(advance, INTERVAL_MS);
  };
  const stop = () => window.clearInterval(timer);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stop();
      goTo(index);
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
  }
}
