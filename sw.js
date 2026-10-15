// かんよチャンネル用：このファイルは今後さわらなくてOK（v3）
const CACHE="kanyo-ch-v3";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||!r.url.startsWith(self.location.origin))return;
  if(r.url.includes("reset.html"))return;
  if(r.mode==="navigate"){
    // ページはいつもネットから。ネットがない時だけ保存版。
    e.respondWith(fetch(r).then(res=>{if(res.ok&&!res.redirected){const c=res.clone();caches.open(CACHE).then(x=>x.put("./",c))}return res}).catch(()=>caches.match("./").then(h=>h||new Response("ネットに つながっていません",{headers:{"Content-Type":"text/plain; charset=utf-8"}}))));
    return;
  }
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
});
