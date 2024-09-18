const CACHE_NAME = 'golden-pack-cache-v1';
const urlsToCache = [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/assets/css/styles.css',
    '/assets/js/login.js',
    '/assets/js/register.js',
    '/assets/js/register-company.js',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// Instalar o service worker e cachear os arquivos necessários
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Arquivos cacheados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar as requisições e servir os arquivos do cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Se estiver no cache, retorna o cache
                }
                return fetch(event.request); // Caso contrário, busca da rede
            })
    );
});

// Atualizar o service worker quando necessário
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
