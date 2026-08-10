export function initGalleryFilter(): void {
  const root = document.querySelector<HTMLElement>('[data-gallery-filter]');
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-item]'));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';
      buttons.forEach((b) => b.classList.toggle('is-active', b === button));
      cards.forEach((card) => {
        const tags = (card.dataset.tags ?? '').split(' ');
        card.classList.toggle('is-hidden', filter !== 'all' && !tags.includes(filter));
      });
    });
  });
}
