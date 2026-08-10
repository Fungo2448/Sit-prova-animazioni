import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  '/images/square-01.jpg',
  '/images/square-02.jpg',
  '/images/square-03.jpg',
  '/images/square-04.jpg',
  '/images/square-05.jpg',
  '/images/square-06.jpg',
  '/images/square-07.jpg',
  '/images/square-08.jpg',
];

const RADIUS = 620;

interface Card {
  el: HTMLElement;
  angle: number;
}

function renderCards(images: string[]): string {
  const step = 360 / images.length;
  return images
    .map((src, i) => {
      const angle = i * step;
      return `
        <figure class="portfolio3d__card" style="transform: rotateY(${angle}deg) translateZ(${RADIUS}px);" data-angle="${angle}">
          <img src="${src}" width="1100" height="1100" alt="" loading="lazy" />
        </figure>`;
    })
    .join('');
}

/** Brightens/enlarges whichever card currently faces the viewer as the carousel turns. */
function updateCardDepth(cards: Card[], carouselRotation: number): void {
  cards.forEach(({ el, angle }) => {
    const absolute = (((angle + carouselRotation) % 360) + 360) % 360;
    const distanceFromFront = Math.min(absolute, 360 - absolute);
    const proximity = 1 - distanceFromFront / 180;
    el.style.opacity = String(0.35 + proximity * 0.65);
    el.style.filter = `brightness(${0.6 + proximity * 0.4})`;
  });
}

export function initPortfolio3D(): void {
  const section = document.querySelector<HTMLElement>('[data-portfolio3d]');
  const pinTarget = section?.querySelector<HTMLElement>('[data-portfolio3d-pin]');
  const carousel = section?.querySelector<HTMLElement>('[data-carousel]');
  if (!section || !pinTarget || !carousel) return;

  carousel.innerHTML = renderCards(IMAGES);
  const cards: Card[] = Array.from(carousel.querySelectorAll<HTMLElement>('.portfolio3d__card')).map((el) => ({
    el,
    angle: Number(el.dataset.angle),
  }));

  // The carousel only ever rotates on Y (scroll-driven, below); the static
  // "looking slightly down" camera tilt lives on .portfolio3d__stage in CSS
  // instead, so it rigidly tilts the whole 3D scene rather than compounding
  // with the per-frame rotation (mixing a static rotateX into the same
  // matrix as an animated rotateY pushes some card angles past the
  // perspective plane and blows up their scale).
  updateCardDepth(cards, 0);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=250%',
    scrub: 1,
    pin: pinTarget,
    onUpdate: (self) => {
      const rotation = self.progress * 360;
      gsap.set(carousel, { rotateY: rotation });
      updateCardDepth(cards, rotation);
    },
  });
}
