var CACHE = 'oks-docs-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll([
        '/zs-oks/',
        '/zs-oks/index.html',
        '/zs-oks/index.md',
        '/zs-oks/404.html',
        '/zs-oks/favicon.svg',
        'https://cdn.jsdelivr.net/npm/docsify@5',
        'https://cdn.jsdelivr.net/npm/docsify@5/dist/themes/core.min.css',
        'https://cdn.jsdelivr.net/npm/docsify@5/dist/themes/addons/vue.min.css',
        'https://cdn.jsdelivr.net/npm/docsify@5/lib/plugins/search.min.js',
        'https://cdn.jsdelivr.net/npm/docsify@5/lib/plugins/pwa.min.js',
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  if (url.pathname.startsWith('/zs-oks/') || url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          var fetchPromise = fetch(event.request).then(function (networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              var responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache);
            }
            return networkResponse;
          }).catch(function () {
            return cache.match('/zs-oks/');
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
