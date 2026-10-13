// Soxta Firestore — daftar.js sinovlari uchun (Node). Haqiqiy Firebase'ga hech qanday so'rov chiqmaydi.
// Bitta «server» (cloud) va bir nechta «mijoz» (telefon). daftar.js ishlatadigan API qoplanadi:
// collection/doc/set/get/where/orderBy/onSnapshot, batch, runTransaction, serverTimestamp.
// Firebase qoidasi taqlidi (2-bosqichdagi haqiqiy qoida kabi): yozuvlar faqat YARATILADI (bor hujjat — rad),
// ol == 1 shart; navbat raqami faqat +1 oshadi.

export class Vaqt {
  constructor(ms){ this._ms = ms; }
  toMillis(){ return this._ms; }
}
const SERVER_TS = { __serverTs: true };
const nusxa = x => JSON.parse(JSON.stringify(x, (k, v) => v instanceof Vaqt ? { __vaqt: v._ms } : v),
  (k, v) => v && typeof v === 'object' && '__vaqt' in v ? new Vaqt(v.__vaqt) : v);
const kut = ms => new Promise(r => setTimeout(r, ms));
const xato = (code, msg) => Object.assign(new Error(msg || code), { code });

export function soxtaServer(soat = 1_800_000_000_000){
  const s = {
    hujjatlar: new Map(),       // yo'l → { data, v }
    soat,                       // server vaqti (ms) — har yozishda oshadi
    mijozlar: new Set(),
    radEt: new Set(),           // sinov: shu id li yozuvni qoida rad etadi (hujjat yaratilmaydi)
    yozuvSoni: 0,
    qadam: 1000,
  };
  s.vaqtOl = () => (s.soat += s.qadam);
  // Atomik yozish: [{yol, data}] — hammasi yoki hech biri. Qoida tekshiruvi shu yerda.
  s.yoz = (yozuvlar) => {
    const t = new Vaqt(s.vaqtOl());
    const tayyor = yozuvlar.map(({ yol, data }) => {
      const d = nusxa(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === SERVER_TS ? t : v])));
      if(/\/_daftar\/yozuvlar\/[^/]+$/.test(yol)){
        const id = yol.split('/').pop();
        if(s.hujjatlar.has(yol)) throw xato('permission-denied', 'mavjud yozuvni o\'zgartirib bo\'lmaydi');
        if(d.ol !== 1) throw xato('permission-denied', 'ol == 1 kerak');
        if(s.radEt.has(id) || s.radEt.has(id.split('~')[0])) throw xato('permission-denied', 'sinov: rad');
      }
      if(/\/_daftar\/navbat\/bosh$/.test(yol)){
        const eski = s.hujjatlar.get(yol), n0 = eski ? eski.data.n || 0 : 0;
        if(d.n !== n0 + 1) throw xato('permission-denied', 'navbat faqat +1');
      }
      return { yol, d };
    });
    tayyor.forEach(({ yol, d }) => {
      const eski = s.hujjatlar.get(yol);
      s.hujjatlar.set(yol, { data: d, v: (eski ? eski.v : 0) + 1 });
      s.yozuvSoni++;
    });
    s.mijozlar.forEach(m => m._xabarla());
  };
  return s;
}

export function soxtaMijoz(server, nom){
  const m = {
    nom, online: true,
    kechikish: 0,               // tinglovchiga yetkazish kechikishi (ms)
    javobYoqolsin: false,       // sinov: keyingi tranzaksiya serverga yoziladi, lekin javob yo'qoladi
    navbat: [],                 // offlayn paytdagi yozishlar (Firestore o'zi kabi kutib turadi)
    tinglovchilar: new Set(),
  };
  server.mijozlar.add(m);

  const yolTekshir = yol => yol.split('/').filter(Boolean).join('/');
  function hujjatSnap(yol){
    const h = server.hujjatlar.get(yol);
    return {
      id: yol.split('/').pop(), exists: !!h, ref: { path: yol },
      data: () => h ? nusxa(h.data) : undefined,
    };
  }
  function sorovMos(q, yol, data){
    if(!yol.startsWith(q.yol + '/') || yol.slice(q.yol.length + 1).includes('/')) return false;
    return q.shartlar.every(([f, op, v]) => {
      let a = data[f], b = v;
      if(a instanceof Vaqt) a = a.toMillis();
      if(b instanceof Vaqt) b = b.toMillis();
      if(op === '>=') return a !== undefined && a >= b;
      if(op === '>') return a !== undefined && a > b;
      if(op === '==') return a === b;
      throw new Error('soxta: ' + op);
    });
  }
  function sorovNatija(q){
    const out = [];
    for(const [yol, h] of server.hujjatlar) if(sorovMos(q, yol, h.data)) out.push(yol);
    if(q.tartib){ const f = q.tartib; out.sort((a, b) => {
      const x = server.hujjatlar.get(a).data[f], y = server.hujjatlar.get(b).data[f];
      return (x instanceof Vaqt ? x.toMillis() : x) - (y instanceof Vaqt ? y.toMillis() : y); }); }
    return out;
  }
  function sorov(yol, shartlar = [], tartib = null){
    const q = { yol, shartlar, tartib };
    return {
      where: (f, op, v) => sorov(yol, [...shartlar, [f, op, v]], tartib),
      orderBy: f => sorov(yol, shartlar, f),
      get: async () => {
        if(!m.online) throw xato('unavailable', 'offlayn');
        await kut(0);
        const docs = sorovNatija(q).map(hujjatSnap);
        return { docs, size: docs.length, forEach: fn => docs.forEach(fn) };
      },
      onSnapshot: (opts, next, xatoFn) => {
        const t = { q, next, berildi: new Set(), tirik: true };
        m.tinglovchilar.add(t);
        m._yetkaz(t, true);
        return () => { t.tirik = false; m.tinglovchilar.delete(t); };
      },
    };
  }
  function kolleksiya(yol){
    yol = yolTekshir(yol);
    return Object.assign(sorov(yol), {
      doc: id => hujjat(yol + '/' + id),
    });
  }
  function hujjat(yol){
    return {
      path: yol,
      collection: n => kolleksiya(yol + '/' + n),
      set: data => m._yoz([{ yol, data }]),
      get: async () => {
        if(!m.online) throw xato('unavailable', 'offlayn');
        await kut(0);
        return hujjatSnap(yol);
      },
    };
  }

  // Tinglovchiga yangi hujjatlarni yetkazish (bir xil hujjat bir marta)
  m._yetkaz = (t, birinchi) => {
    const ish = () => {
      if(!t.tirik) return;
      if(!m.online){ if(birinchi) t.next({ docChanges: () => [], metadata: { fromCache: true } }); return; }
      const yangi = sorovNatija(t.q).filter(y => !t.berildi.has(y));
      yangi.forEach(y => t.berildi.add(y));
      if(!yangi.length && !birinchi) return;
      const ch = yangi.map(y => {
        const s = hujjatSnap(y);
        return { type: 'added', doc: { id: s.id, data: () => s.data() } };
      });
      t.next({ docChanges: () => ch, metadata: { fromCache: false } });
    };
    setTimeout(ish, m.kechikish);
  };
  m._xabarla = () => m.tinglovchilar.forEach(t => m._yetkaz(t, false));

  // Yozish: online — darhol serverga; offlayn — navbatga (Firestore kabi, ulanganda tartib bilan ketadi)
  m._yoz = yozuvlar => new Promise((ok, yoq) => {
    const ish = () => { try{ server.yoz(yozuvlar); ok(); }catch(e){ yoq(e); } };
    if(m.online) setTimeout(ish, 0);
    else m.navbat.push(ish);
  });

  const db = {
    collection: kolleksiya,
    batch: () => {
      const list = [];
      return { set: (ref, data) => { list.push({ yol: ref.path, data }); }, commit: () => m._yoz(list) };
    },
    runTransaction: async fn => {
      for(let urinish = 0; urinish < 5; urinish++){
        if(!m.online) throw xato('unavailable', 'offlayn');
        const oqildi = new Map(), yozish = [];
        const tx = {
          get: async ref => {
            await kut(0);
            const h = server.hujjatlar.get(ref.path);
            oqildi.set(ref.path, h ? h.v : 0);
            return hujjatSnap(ref.path);
          },
          set: (ref, data) => { yozish.push({ yol: ref.path, data }); },
        };
        const natija = await fn(tx);          // fn ichidagi xato (masalan 'orqada') to'g'ridan-to'g'ri chiqadi
        await kut(0);
        if(!m.online) throw xato('unavailable', 'offlayn');
        const ozgargan = [...oqildi].some(([yol, v]) => { const h = server.hujjatlar.get(yol); return (h ? h.v : 0) !== v; });
        if(ozgargan) continue;                // Firestore kabi: o'qilgan hujjat o'zgargan — fn qayta ishlaydi
        server.yoz(yozish);
        if(m.javobYoqolsin){ m.javobYoqolsin = false; throw xato('unavailable', 'javob yo\'qoldi'); }
        return natija;
      }
      throw xato('aborted', 'tranzaksiya 5 marta to\'qnashdi');
    },
  };
  m.db = db;
  m.offlayn = () => {
    m.online = false;
    m.tinglovchilar.forEach(t => setTimeout(() => t.tirik && t.next({ docChanges: () => [], metadata: { fromCache: true } }), 0));
  };
  m.onlayn = () => {
    m.online = true;
    const n = m.navbat; m.navbat = [];
    n.forEach(ish => setTimeout(ish, 0));
    m.tinglovchilar.forEach(t => m._yetkaz(t, true));
  };
  return m;
}

export const serverVaqt = () => SERVER_TS;
export const vaqtDan = ms => new Vaqt(ms);
