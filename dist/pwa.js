(() => {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
  let installPrompt;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'xp-pill';
  button.textContent = 'Установить';
  button.hidden = true;
  button.setAttribute('aria-label', 'Установить English Islands на устройство');
  document.querySelector('.top-right')?.append(button);
  window.addEventListener('beforeinstallprompt', event => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    event.preventDefault();
    installPrompt = event;
    button.hidden = false;
  });
  button.addEventListener('click', async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    button.hidden = true;
    await prompt.prompt();
    await prompt.userChoice;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
  });
})();
