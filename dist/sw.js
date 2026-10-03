const CACHE = 'english-islands-pwa-v1';
const CORE = ['./', './index.html', './style.css', './app.js', './activities.js',
  './audit.js', './book-pages.js', './curriculum.js', './data.js',
  './part-one.js', './part-two.js', './pwa.js', './manifest.webmanifest', './dragon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('english-islands-pwa-') && key !== CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type === 'basic') {
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') return cache.match('./index.html');
      return new Response('Этот файл ещё не сохранён. Откройте его с интернетом.',
        {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }
  })());
});
