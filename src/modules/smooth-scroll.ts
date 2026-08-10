import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;

/**
 * Drives Lenis off GSAP's ticker so Lenis' inertia and ScrollTrigger's
 * scroll-linked animations stay perfectly in sync on the same frame.
 * No-ops under prefers-reduced-motion, leaving native scroll in place.
 */
export function initSmoothScroll(): Lenis | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);

  rafCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(rafCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopSmoothScroll(): void {
  lenis?.stop();
}

export function startSmoothScroll(): void {
  lenis?.start();
}

export function getLenis(): Lenis | null {
  return lenis;
}
