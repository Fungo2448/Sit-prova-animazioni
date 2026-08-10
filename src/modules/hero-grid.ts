import { gsap } from 'gsap';

interface ColumnConfig {
  images: string[];
  duration: number;
  direction: 'up' | 'down';
}

const COLUMNS: ColumnConfig[] = [
  { images: ['/images/portrait-01.jpg', '/images/square-01.jpg', '/images/portrait-05.jpg', '/images/landscape-01.jpg'], duration: 26, direction: 'up' },
  { images: ['/images/portrait-02.jpg', '/images/portrait-06.jpg', '/images/square-05.jpg', '/images/portrait-09.jpg'], duration: 34, direction: 'down' },
  { images: ['/images/square-02.jpg', '/images/portrait-03.jpg', '/images/landscape-03.jpg', '/images/portrait-10.jpg'], duration: 22, direction: 'up' },
  { images: ['/images/portrait-04.jpg', '/images/square-06.jpg', '/images/portrait-11.jpg', '/images/landscape-05.jpg'], duration: 30, direction: 'down' },
  { images: ['/images/portrait-07.jpg', '/images/portrait-12.jpg', '/images/square-07.jpg', '/images/portrait-13.jpg'], duration: 24, direction: 'up' },
];

const INTRINSIC_SIZE: Record<string, [number, number]> = {
  portrait: [900, 1200],
  landscape: [1200, 900],
  square: [1100, 1100],
};

function intrinsicSizeFor(src: string): [number, number] {
  const key = Object.keys(INTRINSIC_SIZE).find((prefix) => src.includes(`/${prefix}-`));
  return key ? INTRINSIC_SIZE[key] : [1000, 1000];
}

function renderTrack(images: string[]): string {
  const renderItem = (src: string, eager: boolean) => {
    const [w, h] = intrinsicSizeFor(src);
    return `
    <figure class="hero-grid__item">
      <img src="${src}" width="${w}" height="${h}" alt="" loading="${eager ? 'eager' : 'lazy'}" />
    </figure>`;
  };

  const firstPass = images.map((src, i) => renderItem(src, i === 0)).join('');
  const secondPass = images.map((src) => renderItem(src, false)).join('');

  return `<div class="hero-grid__track">${firstPass}${secondPass}</div>`;
}

function startLoop(track: HTMLElement, { duration, direction }: ColumnConfig): gsap.core.Tween {
  return direction === 'up'
    ? gsap.to(track, { yPercent: -50, duration, ease: 'none', repeat: -1 })
    : gsap.fromTo(track, { yPercent: -50 }, { yPercent: 0, duration, ease: 'none', repeat: -1 });
}

/** Bento-style collage with columns auto-scrolling in a seamless vertical loop. */
export function initHeroGrid(): void {
  const grid = document.querySelector<HTMLElement>('[data-hero-grid]');
  if (!grid) return;

  grid.innerHTML = COLUMNS.map((col) => `<div class="hero-grid__col">${renderTrack(col.images)}</div>`).join('');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tracks = Array.from(grid.querySelectorAll<HTMLElement>('.hero-grid__track'));
  const tweens = tracks.map((track, i) => startLoop(track, COLUMNS[i]));

  grid.addEventListener('mouseenter', () => tweens.forEach((tween) => tween.timeScale(0.15)));
  grid.addEventListener('mouseleave', () => tweens.forEach((tween) => tween.timeScale(1)));
}
