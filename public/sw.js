const CACHE_NAME = 'golden-pack-cache-v2';
const urlsToCache = [
    '/', 
    '/login', 
    '/register', 
    '/dashboard', 
    '/pedidos', 
    '/relatorios', 
    '/rascunhos',
    '/clientes',
    '/produtos',
    '/indicadores',
    '/assets/css/styles.css',
    '/assets/js/login.js',
    '/assets/js/register.js',
    '/assets/js/register-company.js',
    '/assets/js/dashboard.js',
    '/assets/js/pedidos.js',
    '/assets/js/produtos.js',
    '/assets/js/rascunhos.js',
    '/assets/js/relatorios.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/logo.png',
    '/assets/icons/icon-512x512.png'
];

// Instalação: Armazenando os arquivos essenciais no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Arquivos cacheados');
            return cache.addAll(urlsToCache);
        })
    );
});

// Interceptar requisições e usar cache dinâmico para as que não estiverem no cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                // Se o recurso está no cache, retorna ele
                return response;
            }
            // Se não estiver no cache, busca da rede e armazena no cache dinâmico
            return fetch(event.request).then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // Armazena a nova resposta da rede no cache
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Aqui você pode retornar uma página ou imagem padrão caso a rede falhe
                return caches.match('/offline.html');
            });
        })
    );
});

// Atualização: Limpa caches antigos quando o service worker é ativado
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Deleta caches antigos
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
