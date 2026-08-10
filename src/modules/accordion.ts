export function initAccordion(): void {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll<HTMLElement>('.accordion__item'));

    items.forEach((item) => {
      const trigger = item.querySelector<HTMLButtonElement>('.accordion__trigger');
      const panel = item.querySelector<HTMLElement>('.accordion__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');

        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector<HTMLButtonElement>('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
          const otherPanel = other.querySelector<HTMLElement>('.accordion__panel');
          if (otherPanel) otherPanel.style.maxHeight = '';
        });

        if (!wasOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    });
  });
}
