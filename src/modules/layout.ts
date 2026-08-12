import { brandMarkHtml } from './brand';
import { CONTACT_ITEM, NAV_ITEMS, isActivePath } from './nav-config';

function renderHeader(): string {
  const pathname = window.location.pathname;

  const links = NAV_ITEMS.map(
    (item) => `
      <li>
        <a class="nav-label header__link${isActivePath(item.href, pathname) ? ' is-active' : ''}" href="${item.href}">
          ${item.label}
        </a>
      </li>`
  ).join('');

  return `
    <div class="header__bar container">
      <a class="header__logo" href="/" aria-label="Alessandra Romeo — Home">
        ${brandMarkHtml()}
        <span class="header__logo-word nav-label">Alessandra Romeo</span>
      </a>

      <nav class="header__nav" aria-label="Navigazione principale">
        <ul class="header__links">${links}</ul>
      </nav>

      <div class="header__actions">
        <a class="btn btn--ghost nav-label" href="${CONTACT_ITEM.href}">${CONTACT_ITEM.label}</a>
        <button class="header__burger" type="button" aria-label="Apri il menu" aria-expanded="false">
          <span></span><span></span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Rendered as a sibling of #site-header (appended straight to <body>), not
 * nested inside it: #site-header now carries a `transform` for its
 * hide-on-scroll behaviour, and any `position: fixed` descendant of a
 * transformed element is positioned relative to that ancestor instead of
 * the viewport — this fullscreen overlay would end up sized and placed
 * against the shrunk, off-screen header bar instead of covering the screen.
 */
function renderMobileMenu(): string {
  return `
    <div class="mobile-menu" id="mobile-menu">
      <ul class="mobile-menu__links">
        ${NAV_ITEMS.concat(CONTACT_ITEM)
          .map(
            (item) => `
          <li><a class="display-sm mobile-menu__link" href="${item.href}">${item.label}</a></li>`
          )
          .join('')}
      </ul>
    </div>
  `;
}

function renderFooter(): string {
  const year = new Date().getFullYear();

  return `
    <div class="footer__top container">
      <div class="footer__brand">
        ${brandMarkHtml()}
        <p class="body-muted footer__tagline">
          Fotografia di matrimonio di lusso per storie d'amore senza tempo, raccontate in tutto il mondo.
        </p>
      </div>

      <div class="footer__col">
        <span class="eyebrow">Esplora</span>
        <ul class="footer__links">
          <li><a href="/about.html">About</a></li>
          <li><a href="/love-stories.html">Love Stories</a></li>
          <li><a href="/films.html">Films</a></li>
          <li><a href="/investment.html">Investment</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <span class="eyebrow">Contatti</span>
        <ul class="footer__links">
          <li><a href="mailto:hello@alessandraromeo.com">hello@alessandraromeo.com</a></li>
          <li><a href="tel:+390000000000">+39 000 000 0000</a></li>
          <li><a href="https://instagram.com" target="_blank" rel="noopener">@alessandraromeophoto</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <span class="eyebrow">Location</span>
        <p class="body-muted">Como &middot; Lugano<br />Disponibile in tutto il mondo</p>
      </div>
    </div>

    <div class="footer__bottom container">
      <p class="footer__legal">&copy; ${year} Alessandra Romeo Photography. Tutti i diritti riservati.</p>
      <p class="footer__legal">Sito in sviluppo &mdash; immagini segnaposto</p>
    </div>
  `;
}

function setupMobileMenu(header: HTMLElement) {
  const burger = header.querySelector<HTMLButtonElement>('.header__burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

const HEADER_FADE_RANGE = 160; // px scrolled over which the bar background/blur fades in
const HEADER_COLOR_SWITCH = 0.6; // fade progress past which text/logo swap to ink
const HEADER_HIDE_AFTER = 220; // px scrolled before scroll-down starts hiding the bar

function setupScrolledState(header: HTMLElement) {
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const fadeProgress = Math.min(1, y / HEADER_FADE_RANGE);
    header.style.setProperty('--header-fade', String(fadeProgress));
    header.classList.toggle('is-scrolled', fadeProgress > HEADER_COLOR_SWITCH);
    header.classList.toggle('is-hidden', y > HEADER_HIDE_AFTER && y > lastY);

    lastY = y;
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

let headerElRef: HTMLElement | null = null;

/**
 * Forces the header off-screen regardless of scroll direction, for sections
 * that pin/scrub the page themselves (e.g. the portfolio stack) — there,
 * scrolling "back up" means "previous photo", not "go back up the page",
 * so the header's normal show-on-scroll-up behaviour would be wrong.
 * Callers un-suppress once their section is left in either direction.
 */
export function setHeaderSuppressed(suppressed: boolean): void {
  headerElRef?.classList.toggle('is-suppressed', suppressed);
}

export function mountLayout(): void {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');

  if (headerEl) {
    headerEl.innerHTML = renderHeader();
    document.body.insertAdjacentHTML('beforeend', renderMobileMenu());
    setupMobileMenu(headerEl);
    setupScrolledState(headerEl);
    headerElRef = headerEl;
  }

  if (footerEl) {
    footerEl.innerHTML = renderFooter();
  }
}
