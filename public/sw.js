/**
 * Educa SEE — Service Worker Inteligente
 * Versão: educa-see-v5
 *
 * Estratégia de Cache:
 * - Next.js RSC (Server Components / _rsc) & Supabase & APIs: NETWORK ONLY (sempre dados frescos)
 * - Navegação de Páginas HTML (request.mode === 'navigate'): NETWORK FIRST com fallback para cache offline
 * - Ativos Estáticos (_next/static, imagens, fontes): Stale-While-Revalidate
 * - Ativação imediata e limpeza de caches antigos com skipWaiting() e clients.claim()
 */

const CACHE_NAME = 'educa-see-v5';

// Apenas arquivos verdadeiramente estáticos (NUNCA rotas HTML dinâmicas do Next.js)
const STATIC_ASSETS = [
  '/brasao-acre.svg',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Assume o controle imediatamente sem esperar reiniciar abas
  self.skipWaiting();
});

// Ativação e limpeza imediata de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log('[SW] Removendo cache legado:', name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NUNCA interceptar:
  // - Requisições que não sejam GET
  // - Chamadas para o Supabase (*.supabase.co)
  // - Rotas de API interna (/api/*)
  // - Requisições Next.js RSC (_rsc, header RSC, Accept: text/x-component)
  // - Dados dinâmicos do Next.js (/_next/data/*)
  const isRscRequest =
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/x-component')) ||
    url.pathname.includes('/_next/data/');

  if (
    request.method !== 'GET' ||
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/api/') ||
    isRscRequest
  ) {
    return; // Passa direto para a rede nativa do navegador
  }

  // 2. Navegação de páginas HTML (Document): NETWORK FIRST
  // Tenta buscar a versão mais recente do servidor. Se a rede falhar, usa o cache offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          return new Response(
            '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | Educa Brasiléia</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#002045;color:#fff;text-align:center;padding:20px}h1{font-size:22px;margin-bottom:8px}p{color:#cbd5e1;font-size:14px;max-width:320px;margin:0 auto 20px}button{background:#10b981;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer}</style></head><body><div><h1>Você está offline</h1><p>Não foi possível conectar ao Educa Brasiléia. Verifique sua conexão e tente novamente.</p><button onclick="window.location.reload()">Tentar novamente</button></div></body></html>',
            {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }
          );
        })
    );
    return;
  }

  // 3. Recursos estáticos (_next/static, imagens, fontes, svgs): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Mensagens de controle enviadas pelo cliente
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((k) => caches.delete(k)));
      })
    );
  }
});
