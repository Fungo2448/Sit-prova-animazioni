import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { setHeaderSuppressed } from './layout';

gsap.registerPlugin(ScrollTrigger);

interface StackPhoto {
  src: string;
  location: string;
  names: string;
}

// Placeholder set — swap for real curated shots + real couple names later.
const PHOTOS: StackPhoto[] = [
  { src: '/images/square-01.jpg', location: 'Como', names: 'Giulia & Marco' },
  { src: '/images/square-02.jpg', location: 'Positano', names: 'Elena & Tommaso' },
  { src: '/images/square-03.jpg', location: 'Lugano', names: 'Sara & Luca' },
  { src: '/images/square-04.jpg', location: 'Toscana', names: 'Alice & Francesco' },
  { src: '/images/square-05.jpg', location: 'Bellagio', names: 'Rachele & Nicola' },
];

const HOLD = 0.35; // fraction of the ±1 window each photo stays fully opaque
const SCROLL_PER_PHOTO = 80; // vh of scroll dedicated to each photo's transition

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function renderStage(photos: StackPhoto[]): string {
  const items = photos
    .map(
      (photo) => `
        <figure class="portfolio-stack__item" data-item>
          <img src="${photo.src}" alt="" loading="lazy" />
        </figure>`
    )
    .join('');

  const dots = photos.map(() => '<span class="portfolio-stack__dot"></span>').join('');

  return `
    ${items}
    <div class="portfolio-stack__caption" data-caption>
      <p class="portfolio-stack__location" data-caption-location></p>
      <p class="portfolio-stack__names" data-caption-names></p>
    </div>
    <div class="portfolio-stack__dots" data-dots>${dots}</div>
  `;
}

export function initPortfolioStack(): void {
  const section = document.querySelector<HTMLElement>('[data-portfolio-stack]');
  const pinTarget = section?.querySelector<HTMLElement>('[data-portfolio-stack-pin]');
  const stage = section?.querySelector<HTMLElement>('[data-portfolio-stack-stage]');
  if (!section || !pinTarget || !stage) return;

  stage.innerHTML = renderStage(PHOTOS);

  const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-item]'));
  const captionLocation = stage.querySelector<HTMLElement>('[data-caption-location]');
  const captionNames = stage.querySelector<HTMLElement>('[data-caption-names]');
  const dots = Array.from(stage.querySelectorAll<HTMLElement>('.portfolio-stack__dot'));
  const n = items.length;

  function update(progress: number): void {
    const pos = clamp(progress * n, 0, n - 1);
    let activeIndex = 0;
    let bestOpacity = -1;

    items.forEach((el, i) => {
      const local = pos - i;
      const abs = Math.abs(local);
      const opacity = abs <= HOLD ? 1 : clamp(1 - (abs - HOLD) / (1 - HOLD), 0, 1);
      let translateY = 0;
      let scale = 1;
      let dim = 0;

      if (local < 0) {
        translateY = clamp(Math.abs(local), 0, 1) * 46;
      } else if (local > HOLD) {
        const recede = clamp((local - HOLD) / (1 - HOLD), 0, 1);
        scale = 1 - recede * 0.07;
        dim = recede * 0.5;
      }

      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px) scale(${scale})`;
      el.style.filter = `brightness(${1 - dim * 0.4})`;
      el.style.zIndex = String(100 - Math.round(clamp(abs, 0, 10) * 10));

      const img = el.querySelector<HTMLElement>('img');
      if (img) img.style.transform = `translateY(${clamp(local, -1, 1) * 6}%)`;

      if (opacity > bestOpacity) {
        bestOpacity = opacity;
        activeIndex = i;
      }
    });

    const active = PHOTOS[activeIndex];
    if (captionLocation && captionNames && active) {
      captionLocation.textContent = active.location;
      captionNames.textContent = active.names;
    }
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
  }

  update(0);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: `+=${n * SCROLL_PER_PHOTO}%`,
    scrub: 1,
    pin: pinTarget,
    onUpdate: (self) => update(self.progress),
    // Scrolling back "up" inside this section means "previous photo", not
    // "go back up the page" — the header's normal show-on-scroll-up
    // behaviour would fight that, so it's forced hidden for the section's
    // whole duration and released only once actually left, either way.
    onEnter: () => setHeaderSuppressed(true),
    onEnterBack: () => setHeaderSuppressed(true),
    onLeave: () => setHeaderSuppressed(false),
    onLeaveBack: () => setHeaderSuppressed(false),
  });
}
