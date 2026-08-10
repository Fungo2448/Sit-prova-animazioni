export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about.html', label: 'About' },
  { href: '/love-stories.html', label: 'Love Stories' },
  { href: '/films.html', label: 'Films' },
  { href: '/investment.html', label: 'Investment' },
];

export const CONTACT_ITEM: NavItem = { href: '/contact.html', label: 'Contact' };

/** Normalizes the current pathname so both "/" and "/index.html" match the Home link. */
export function isActivePath(href: string, pathname: string): boolean {
  const normalize = (p: string) => (p === '/index.html' ? '/' : p);
  return normalize(href) === normalize(pathname);
}
