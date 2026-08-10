export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submitButton?.setAttribute('disabled', 'true');
    if (submitButton) submitButton.textContent = 'Invio in corso…';

    // Placeholder site: no backend yet. Simulates a send so the interaction
    // and micro-copy can be reviewed before real form handling is wired up.
    window.setTimeout(() => {
      form.reset();
      submitButton?.removeAttribute('disabled');
      if (submitButton) submitButton.textContent = 'Invia Messaggio';
      if (status) {
        status.textContent = 'Grazie! Il tuo messaggio è stato inviato, ti risponderò al più presto.';
        status.classList.add('is-visible');
      }
    }, 900);
  });
}
