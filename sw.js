const V='italia2026-v1';
const FILES=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png','favicon-32.png',
'fonts/bodoni-moda-latin-wght-normal.woff2','fonts/bodoni-moda-latin-wght-italic.woff2','fonts/figtree-latin-wght-normal.woff2','fonts/figtree-latin-wght-italic.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return; // links externos (Google Maps) seguem a rede
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));return res;
  }).catch(()=>caches.match('index.html'))));
});
