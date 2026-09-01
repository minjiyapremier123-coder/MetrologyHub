const CACHE_NAME = 'metrology-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Stale-while-revalidate minimal setup for offline sync simulation
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Fallback logic could go here
                });
            })
    );
});

// IndexedDB Helper for Background Sync
function getOfflineQueue() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('keyval-store');
        req.onsuccess = e => {
            const db = e.target.result;
            try {
                const tx = db.transaction('keyval', 'readonly');
                const store = tx.objectStore('keyval');
                const req2 = store.get('metrology_offline_queue');
                req2.onsuccess = () => resolve(req2.result || []);
                req2.onerror = () => resolve([]);
            } catch (err) {
                resolve([]);
            }
        };
        req.onerror = () => resolve([]);
    });
}

function clearOfflineQueue() {
    return new Promise((resolve) => {
        const req = indexedDB.open('keyval-store');
        req.onsuccess = e => {
            const db = e.target.result;
            try {
                const tx = db.transaction('keyval', 'readwrite');
                tx.objectStore('keyval').put([], 'metrology_offline_queue');
                tx.oncomplete = () => resolve();
            } catch (err) {
                resolve();
            }
        };
    });
}

self.addEventListener('sync', event => {
    if (event.tag === 'sync-offline-scans') {
        event.waitUntil(
            getOfflineQueue().then(queue => {
                if (!queue || queue.length === 0) return;
                console.log('[SW] Syncing offline scans:', queue.length);
                return clearOfflineQueue();
                // In production, we would map the queue to fetch() calls here before clearing.
            })
        );
    }
});
