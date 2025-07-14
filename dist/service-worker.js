const CACHE_NAME = 'ai-sky-net-cache-v1';
const STATIC_ASSETS = [
  '/assets/css/',
  '/assets/js/',
  '/fonts/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ответ если он есть
        if (response) {
          return response;
        }

        // Иначе делаем сетевой запрос
        return fetch(event.request).then(
          (response) => {
            // Проверяем валидность ответа
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Кэшируем новый ответ
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
