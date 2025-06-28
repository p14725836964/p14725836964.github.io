
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("trade-journal-cache").then(cache =>
            cache.addAll([
                "./",
                "./index.html",
                "./new.html",
                "./report.html",
                "./style.css",
                "./script.js",
                "./report.js",
                "./manifest.json",
                "./icon.png"
            ])
        )
    );
});
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resp => resp || fetch(e.request))
    );
});
