import './styles/main.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initAccordion } from './modules/accordion';
import { initContactForm } from './modules/contact-form';
import { initGalleryFilter } from './modules/gallery-filter';
import { initHeroGrid } from './modules/hero-grid';
import { mountLayout } from './modules/layout';
import { initLoader } from './modules/loader';
import { initMagneticButtons } from './modules/magnetic';
import { initParallax } from './modules/parallax';
import { initPortfolio3D } from './modules/portfolio-3d';
import { initRevealAnimations } from './modules/reveal';
import { initSmoothScroll } from './modules/smooth-scroll';
import { initTestimonialSlider } from './modules/testimonial-slider';

mountLayout();

// Content-injecting modules run before ScrollTrigger-dependent ones so
// pin/scrub distances are measured against the final DOM, not an empty shell.
initHeroGrid();
initPortfolio3D();

initSmoothScroll();
initLoader();
initRevealAnimations();
initParallax();
initMagneticButtons();
initTestimonialSlider();
initContactForm();
initGalleryFilter();
initAccordion();

// Self-hosted fonts and generated images can still shift layout after the
// above run; re-measure pinned/scrubbed triggers once everything has settled.
window.addEventListener('load', () => ScrollTrigger.refresh());
