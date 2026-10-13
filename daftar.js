// ═══════════ KABIR DAFTAR — d1 ═══════════
// Bitta daftar: har amal (sotuv, jo'natish, to'lov, tahrir …) bazaga to'g'ridan yozilmaydi — daftar oxiriga
// BITTA qator bo'lib qo'shiladi: <kol>/_daftar/yozuvlar/<id>. Qator o'zgarmaydi va o'chmaydi (Firebase qoidasi:
// faqat qo'shish). Hozirgi holat — hamma qatorlarni cloud vaqti (t, keyin id) tartibida qo'llash natijasi.
// G'oya va sinalgan yechimlar Tilla ERP daftar.js dan (v188.81 + v188.85); kod Kabir jadvallari uchun yozilgan.
//
// Holat (baza): { products: {id: hujjat}, units: {…}, stores, sales, orders, customers, activity } — bazadagi
// snake_case ko'rinishda, xuddi Firestore hujjatlari kabi (id maydoni bilan).
//
// Kalitlar (yassi ko'rinish — har kalit alohida o'zgaradi: ikki telefon turli kalitni o'zgartirsa ikkalasi ham
// saqlanadi, bitta kalitni — cloud vaqti bo'yicha keyingisi):
//   <jadval>:<id>                     hujjat bor ('1')
//   <jadval>:<id>.<maydon>            maydon qiymati (JSON) — faqat MAYDON ro'yxatidagilar
//   sales:<id>.partial_payments       massiv bor ('1');   sales:<id>.pp:<to'lov id>    bitta qisman to'lov
//   orders:<id>.status_history        massiv bor ('1');   orders:<id>.sh:<vaqt>~<n>    bitta status yozuvi
// Daftarga kirmaydi: users (loginlar), products.image (rasm alohida saqlanadi), ro'yxatda yo'q maydonlar
// (holatdagi camelCase nusxalar — unitId, costItems …) — ular sanab boriladi (tashlandi()).
//
// Ilova bilan bog'lanish — amal(izoh, qur, {qulf}): qur(baza) amalning hamma yozuvlarini hozirgi holatdan
// quradi: [{t:'insert'|'upsert', j:jadval, r:hujjat|[hujjatlar]}, {t:'update', j, id, f:{maydonlar}},
// {t:'delete', j, id}]. Xulq hozirgi Firestore o'rami bilan bir xil: insert — hujjat to'liq almashadi,
// upsert/update — faqat kelgan maydonlar (massiv butunligicha), delete — hujjat o'chadi. Rad etish: {rad:'sabab'}.
//
// OMBOR QULFI: qulfli amal (sotuv, jo'natish, qaytarish, omborga qo'shish, o'chirish, yangi zakaz) cloud navbat
// raqami bilan BITTA tranzaksiyada yoziladi (_daftar/navbat/bosh {n}). Qurilma raqam oladi faqat hamma oldingi
// qulfli amalni ko'rgan bo'lsa. Ko'rmagan bo'lsa — avval oladi, keyin amalni QAYTA quradi: unit ID / ZK- sanog'i
// yangidan hisoblanadi, mol allaqachon sotilgan bo'lsa — rad. Qulfli amal internetsiz saqlanmaydi.
// Qulfsiz amal (to'lov, tahrir …) internetsiz ham saqlanadi: navbatga turadi va ulanganda TARTIB bilan ketadi.

(function(root){
'use strict';

var DAFTAR_VER = 'd1';
var BOLAK = 300000;          // bitta hujjatga sig'adigan o'zgarishlar (belgi) — Firestore 1 MB chegarasidan past
var USTMA = 5 * 60 * 1000;   // qayta ulanganda oxirgi 5 daqiqani yana so'raymiz (id bo'yicha takrorlanmaydi)

var MAYDON = {
  products:  ['name', 'sku', 'category', 'dimensions', 'cost', 'price', 'markup', 'cost_items', 'price_incomplete', 'created_at'],
  units:     ['unit_id', 'product_id', 'location', 'status', 'added_at', 'sent_at'],
  stores:    ['name', 'address', 'manager', 'phone', 'created_at'],
  sales:     ['unit_ids', 'store_id', 'product_id', 'customer_id', 'customer_name', 'qty', 'price', 'cost', 'total_amount',
              'paid', 'pay_date', 'pay_method', 'debt_due', 'date', 'created_at'],
  orders:    ['order_id', 'store_id', 'product_id', 'qty', 'note', 'deadline', 'price', 'prepaid', 'status', 'created_at'],
  customers: ['name', 'phone', 'created_at'],
  activity:  ['action', 'details', 'time']
};
var MASSIV = { sales: { partial_payments: 'pp' }, orders: { status_history: 'sh' } };   // massiv elementlari alohida kalit
var JADVALLAR = Object.keys(MAYDON);
var MSET = {};
JADVALLAR.forEach(function(j){ MSET[j] = {}; MAYDON[j].forEach(function(f){ MSET[j][f] = 1; }); });

function yangiId(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }
function imzo(s){   // matn barmoq izi (FNV-1a, ikki xil boshlang'ich) + uzunlik
  var a = 2166136261, b = 5381;
  for(var i = 0; i < s.length; i++){ var c = s.charCodeAt(i); a = Math.imul(a ^ c, 16777619); b = ((b << 5) + b + c) | 0; }
  return (a >>> 0).toString(36) + '-' + (b >>> 0).toString(36) + '-' + s.length;
}
function royxat(x){ return (Array.isArray(x) ? x : [x]).map(String); }
function bosh(){ var b = {}; JADVALLAR.forEach(function(j){ b[j] = {}; }); return b; }

// Firestore hujjatlari ro'yxatidan holat: { products: [hujjat, …], … } → { products: {id: hujjat}, … }
function bazaDan(r, tashla){
  var b = bosh();
  JADVALLAR.forEach(function(j){
    (Array.isArray(r && r[j]) ? r[j] : []).forEach(function(h){
      if(!h || h.id === undefined || h.id === null || h.id === ''){ if(tashla) tashla(j, '(id yo\'q)'); return; }
      b[j][String(h.id)] = JSON.parse(JSON.stringify(h));
    });
  });
  return b;
}

// ── 1. YASSILASH: holat → {kalit: qiymat-matn} ──
function ppKalit(p, i){ return p && p.id !== undefined && p.id !== null && p.id !== '' ? String(p.id) : '~' + i; }
function shKalitlar(arr){
  var n = {};
  return arr.map(function(x){ var t = String(x && x.time !== undefined ? x.time : ''); n[t] = (n[t] || 0) + 1; return t + '~' + n[t]; });
}
function hujjatYassi(j, id, h, m, tashla){
  if(String(id).indexOf('.') >= 0){ if(tashla) tashla(j, '(id nuqtali)'); return; }   // kalitni buzadi — sanaladi
  var dk = j + ':' + id, ms = MASSIV[j] || {};
  m[dk] = '1';
  Object.keys(h).forEach(function(f){
    var v = h[f];
    if(f === 'id' || v === undefined) return;
    if(ms[f]){
      if(!Array.isArray(v)){ if(tashla) tashla(j, f); return; }
      m[dk + '.' + f] = '1';
      var kl = ms[f] === 'sh' ? shKalitlar(v) : v.map(ppKalit);
      v.forEach(function(x, i){ m[dk + '.' + ms[f] + ':' + kl[i]] = JSON.stringify(x); });
      return;
    }
    if(!MSET[j][f]){ if(tashla) tashla(j, f); return; }
    m[dk + '.' + f] = JSON.stringify(v);
  });
}
function yassi(baza, tashla){
  var m = {};
  JADVALLAR.forEach(function(j){
    var t = (baza && baza[j]) || {};
    Object.keys(t).forEach(function(id){ hujjatYassi(j, id, t[id], m, tashla); });
  });
  return m;
}

// ── 2. FARQ: ikki yassi ko'rinish orasidagi o'zgarishlar. ['s', kalit, qiymat] · ['d', kalit] ──
function farq(a, b){
  var ops = [], k;
  for(k in b) if(a[k] !== b[k]) ops.push(['s', k, b[k]]);
  for(k in a) if(b[k] === undefined) ops.push(['d', k]);
  return ops;
}

// Yassi ko'rinish + hujjat bo'yicha ko'rsatkich (hujjat kaliti → uning ichki kalitlari)
function dkOl(k){ var i = k.indexOf('.'); return i < 0 ? k : k.slice(0, i); }
function Holat(m){ var H = { m: m, ix: {} }; for(var k in m) ixQo(H.ix, k); return H; }
function ixQo(ix, k){ var d = dkOl(k); if(d !== k) (ix[d] || (ix[d] = {}))[k] = 1; }
function ixOl(ix, k){ var d = dkOl(k); if(d !== k && ix[d]){ delete ix[d][k]; } }

// ── 3. QO'LLASH: o'zgarishlarni H ga qo'llaydi, tegilgan hujjatlarni baza da qayta quradi ──
function ppTartib(a, b){
  var da = String((a[1] && a[1].date) || ''), db = String((b[1] && b[1].date) || '');
  if(da !== db) return da < db ? -1 : 1;
  var na = a[0].charAt(0) === '~' ? +a[0].slice(1) : NaN, nb = b[0].charAt(0) === '~' ? +b[0].slice(1) : NaN;
  if(!isNaN(na) && !isNaN(nb)) return na - nb;
  return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function shTartib(a, b){
  var ia = a[0].lastIndexOf('~'), ib = b[0].lastIndexOf('~'), ta = a[0].slice(0, ia), tb = b[0].slice(0, ib);
  if(ta !== tb) return ta < tb ? -1 : 1;
  return (+a[0].slice(ia + 1)) - (+b[0].slice(ib + 1));
}
function hujjatQur(baza, H, d){
  var i = d.indexOf(':'), j = d.slice(0, i), id = d.slice(i + 1);
  if(!baza[j]) baza[j] = {};
  if(H.m[d] === undefined){ delete baza[j][id]; return; }
  var h = { id: id }, ms = MASSIV[j] || {}, el = {}, ich = H.ix[d] || {};
  Object.keys(ms).forEach(function(f){ el[ms[f]] = []; });
  Object.keys(ich).forEach(function(k){
    var r = k.slice(d.length + 1), c = r.indexOf(':');
    if(c > 0 && el[r.slice(0, c)]){ el[r.slice(0, c)].push([r.slice(c + 1), JSON.parse(H.m[k])]); return; }
    if(ms[r]) return;                                          // massiv belgisi — pastda
    h[r] = JSON.parse(H.m[k]);
  });
  Object.keys(ms).forEach(function(f){
    var tur = ms[f], list = el[tur];
    if(H.m[d + '.' + f] === undefined && !list.length) return;
    list.sort(tur === 'sh' ? shTartib : ppTartib);
    h[f] = list.map(function(x){ return x[1]; });
  });
  baza[j][id] = h;
}
function qolla(baza, H, ops){
  var tegdi = {}, yetim = 0;
  function daraja(op){ if(op[1].indexOf('.') < 0) return op[0] === 's' ? 0 : 2; return 1; }   // bor → maydonlar → o'chirish
  ops.slice().sort(function(a, b){ return daraja(a) - daraja(b); }).forEach(function(op){
    var k = op[1], d = dkOl(k);
    if(k === d){
      if(op[0] === 's') H.m[k] = op[2];
      else {
        delete H.m[k];
        var ich = H.ix[d]; if(ich){ for(var x in ich) delete H.m[x]; delete H.ix[d]; }
      }
      tegdi[d] = 1; return;
    }
    if(op[0] === 's'){
      if(H.m[d] === undefined){ yetim++; return; }   // hujjat yo'q (boshqa telefonda o'chirilgan) — egasiz
      H.m[k] = op[2]; ixQo(H.ix, k);
    } else { delete H.m[k]; ixOl(H.ix, k); }
    tegdi[d] = 1;
  });
  Object.keys(tegdi).forEach(function(d){ hujjatQur(baza, H, d); });
  return yetim;
}

// ── 4. YOZUVLARDAN O'ZGARISH: qur() bergan yozuvlar → ops (H ga hali qo'llanmaydi) ──
function opsHisobla(H, yozuvlar, tashla){
  var ov = {}, ovIx = {};   // ov[k] = yangi qiymat | null (o'chadi)
  function ol(k){ return k in ov ? ov[k] : (H.m[k] === undefined ? null : H.m[k]); }
  function qoy(k, v){ ov[k] = v; var d = dkOl(k); if(d !== k) (ovIx[d] || (ovIx[d] = {}))[k] = 1; }
  function ichki(d){
    var s = {}, k, a = H.ix[d] || {}, b = ovIx[d] || {};
    for(k in a) if(ol(k) !== null) s[k] = 1;
    for(k in b) if(ov[k] !== null) s[k] = 1;
    return s;
  }
  (yozuvlar || []).forEach(function(y){
    if(!y || !MAYDON[y.j]) throw new Error('daftar: noma\'lum jadval ' + (y && y.j));
    var j = y.j;
    if(y.t === 'delete'){
      royxat(y.id).forEach(function(id){
        var d = j + ':' + id, s = ichki(d);
        for(var k in s) qoy(k, null);
        if(ol(d) !== null) qoy(d, null);
      });
      return;
    }
    if(y.t !== 'insert' && y.t !== 'upsert' && y.t !== 'update') throw new Error('daftar: noma\'lum yozuv turi ' + y.t);
    var qatorlar = y.t === 'update'
      ? royxat(y.id).map(function(id){ return Object.assign({}, y.f, { id: id }); })
      : (Array.isArray(y.r) ? y.r : [y.r]);
    qatorlar.forEach(function(r){
      if(!r || r.id === undefined || r.id === null || r.id === '') throw new Error('daftar: id yo\'q (' + j + ')');
      var id = String(r.id), d = j + ':' + id, yangi = {}, k;
      var toza = JSON.parse(JSON.stringify(r));        // Firestore o'rami kabi: undefined tashlanadi
      hujjatYassi(j, id, toza, yangi, tashla);
      if(y.t === 'update'){
        if(ol(d) === null) return;                     // yo'q hujjat yangilanmaydi (Firestore update xato beradi)
        delete yangi[d];
      }
      if(y.t === 'insert'){
        var eski = ichki(d);
        for(k in eski) if(!(k in yangi)) qoy(k, null);
      } else {                                          // upsert/update: kelgan massiv butunligicha almashadi
        Object.keys(MASSIV[j] || {}).forEach(function(f){
          if(!(f in toza)) return;
          var pre = d + '.' + MASSIV[j][f] + ':', s = ichki(d);
          for(var kk in s) if(kk.indexOf(pre) === 0 && !(kk in yangi)) qoy(kk, null);
        });
      }
      for(k in yangi) if(ol(k) !== yangi[k]) qoy(k, yangi[k]);
    });
  });
  var ops = [];
  Object.keys(ov).forEach(function(k){
    var v = ov[k], h = H.m[k];
    if(v === null){ if(h !== undefined) ops.push(['d', k]); }
    else if(h !== v) ops.push(['s', k, v]);
  });
  return ops;
}

// ── 5. CLOUD QISMI ──
// env: { db(), kol(), qurilma(), ver, serverVaqt(), vaqtDan(ms), xomOl(), lokalSaqla(json), metaOl(), metaYoz(obj),
//        yangilandi(baza), holat(rang, matn), kutish(matn|null), xatoLog(e), izla(tur, x), vaqt: {…sinov uchun} }
// xomOl — qurilmada saqlangan holat matni (oxirgi lokalSaqla); metaOl/metaYoz — kichik meta (navbat, ko'rilganlar).
function Daftar(env){
  var V = Object.assign({ navbat: 5000, orqada: 8000, sora: 2000, nomalum: 3000, qadam: 100 }, env.vaqt || {});
  var baza = bosh(), H = Holat({}), meta, unsub = null, kutish = {}, kalitKutish = {}, soya = {}, oxirgiOz = {},
      bolaklar = {}, serverdan = false, xato = '', boshlandi = false, tartibsiz = 0, tashlandi = {},
      cj = null;   // cloud tasdig'ini kutayotgan qulfli amal
  function keyin(a, b){ if(!b) return true; if(!a) return false; return a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]); }
  function tashla(j, f){ var k = j + '.' + f; tashlandi[k] = (tashlandi[k] || 0) + 1; }

  function metaSaqla(){
    var chek = (meta.oxirgiT || 0) - 2 * USTMA;   // ko'rilganlar ro'yxati faqat ustma oynasi uchun kerak
    Object.keys(meta.korildi).forEach(function(id){ if(meta.korildi[id] < chek) delete meta.korildi[id]; });
    Object.keys(meta.kt).forEach(function(k){ if(meta.kt[k][0] < chek) delete meta.kt[k]; });
    var m = Object.keys(meta.kt).length > 5000 ? Object.assign({}, meta, { kt: {} }) : meta;   // ko'chirishdan keyin juda katta
    try{ env.metaYoz(JSON.parse(JSON.stringify(m))); }catch(e){ if(env.xatoLog) env.xatoLog(e); }
  }
  function boshla(){
    meta = env.metaOl() || {};
    meta.oxirgiT = meta.oxirgiT || 0; meta.korildi = meta.korildi || {}; meta.chiqish = meta.chiqish || [];
    meta.yetim = meta.yetim || 0; meta.chK = meta.chK || 0; meta.chOrt = meta.chOrt || {};
    var xom = env.xomOl ? env.xomOl() : null, saqlangan = null;
    // Qurilmadagi holat — dvigatel oxirgi marta yozgan nusxaning O'ZImi (imzo)? Bo'lmasa (yangi qurilma, kesh tozalandi,
    // qo'lda o'zgartirildi) — unga ishonilmaydi: holat bo'shatiladi va daftar BOSHIDAN o'qiladi.
    var ishonch = !!(meta.imzo && xom !== null && xom !== undefined && imzo(xom) === meta.imzo);
    if(ishonch){ try{ saqlangan = JSON.parse(xom); }catch(e){ ishonch = false; } }
    if(!ishonch){
      meta.oxirgiT = 0; meta.korildi = {}; meta.kt = {}; meta.soya = {}; meta.oxirgiOz = {}; meta.yetim = 0; meta.chK = 0; meta.chOrt = {};
      meta.chiqish.forEach(function(e){ e.lokal = 0; });
      baza = bosh();
    } else {
      baza = bosh(); JADVALLAR.forEach(function(j){ if(saqlangan && saqlangan[j]) baza[j] = saqlangan[j]; });
    }
    soya = meta.soya = meta.soya || {}; oxirgiOz = meta.oxirgiOz = meta.oxirgiOz || {}; meta.kt = meta.kt || {};
    // navbatdagi o'z yozuvlarim: holatda borlari (lokal) — tasdiqlanganda qayta qo'llanmaydi; yo'qlari — boshqa
    // telefonnikidek, daftardan kelganda o'z tartibida qo'llanadi
    meta.chiqish.forEach(function(e){ if(e.lokal){ kutish[e.id] = e; belgila(e, +1); } });
    H = Holat(yassi(baza, tashla));
    boshlandi = true;
    if(env.izla) env.izla('boshla', { qayta: !ishonch, chiqish: meta.chiqish.length });
    lokalYoz();
    holatYangila();
  }
  function lokalYoz(){
    var j = JSON.stringify(baza);
    try{ env.lokalSaqla(j); }
    catch(e){ xato = 'joy'; holatYangila(); if(env.xatoLog) env.xatoLog(e); return; }   // qurilma xotirasi to'ldi
    if(xato === 'joy') xato = '';
    meta.imzo = imzo(j);
    metaSaqla();
  }
  function belgila(e, n){
    JSON.parse(e.o).forEach(function(op){ kalitKutish[op[1]] = (kalitKutish[op[1]] || 0) + n; if(kalitKutish[op[1]] <= 0) delete kalitKutish[op[1]]; });
  }
  function yozuv(izoh, ops){
    return { id: yangiId('y'), q: env.qurilma(), v: DAFTAR_VER + (env.ver ? '/' + env.ver : ''), iz: String(izoh || '').slice(0, 300), ts: Date.now(), o: JSON.stringify(ops) };
  }
  function xabar(sabab, asl){ var x = new Error(sabab); x.sabab = sabab; if(asl) x.asl = asl; return x; }

  // AMAL — ilovadan. Promise: muvaffaqiyat — o'zgargan kalitlar soni; rad — Error, .sabab:
  // 'internet' | 'navbat' | 'band' | 'rad' | 'xato' | qur() bergan sabab.
  function amal(izoh, qur, opt){
    if(!boshlandi) boshla();
    if(opt && opt.qulf) return qulfli(izoh, qur);
    var yoz;
    try{ yoz = qur(baza); }catch(err){ return Promise.reject(xabar('xato', err)); }
    if(yoz && yoz.rad) return Promise.reject(xabar(yoz.rad));
    var ops;
    try{ ops = opsHisobla(H, yoz, tashla); }catch(err){ return Promise.reject(xabar('xato', err)); }
    if(!ops.length) return Promise.resolve(0);
    var e = yozuv(izoh, ops);
    meta.chiqish.push(e); kutish[e.id] = e; belgila(e, +1);
    if(env.izla) env.izla('amal', e.id);
    metaSaqla();                       // avval navbat — holat yozilmasdan uzilsa ham amal yo'qolmaydi
    meta.yetim += qolla(baza, H, ops);
    e.lokal = 1;                       // holat bilan birga yoziladi — qayta ochilganda qayta qo'llanmaydi
    lokalYoz();
    if(unsub) yubor(e);                // ulanmagan bo'lsa ulan() navbatni TARTIB bilan yuboradi
    holatYangila();
    if(env.yangilandi) env.yangilandi(baza);
    return Promise.resolve(ops.length);
  }

  function ref(){ var db = env.db(); return db ? db.collection(env.kol()).doc('_daftar').collection('yozuvlar') : null; }
  function navbatRef(){ var db = env.db(); return db ? db.collection(env.kol()).doc('_daftar').collection('navbat').doc('bosh') : null; }
  function hujjatlar(e){   // yozuv → Firestore hujjatlari (katta bo'lsa bo'laklarga)
    if(e.o.length <= BOLAK) return [{ id: e.id, x: { o: e.o } }];
    var n = Math.ceil(e.o.length / BOLAK), out = [];
    for(var i = 0; i < n; i++) out.push({ id: e.id + '~' + i, x: { g: e.id, i: i, n: n, o: e.o.slice(i * BOLAK, (i + 1) * BOLAK) } });
    return out;
  }
  function yubor(e){
    var r = ref(); if(!r) return;
    var umumiy = { q: e.q, v: e.v, iz: e.iz, ts: e.ts, t: env.serverVaqt(), ol: 1 }, p, docs = hujjatlar(e);   // ol — Firebase qoidasi talab qiladi
    try{
      if(docs.length === 1) p = r.doc(docs[0].id).set(Object.assign({}, docs[0].x, umumiy));
      else {   // bo'laklar bitta batch'da — hammasi birga yoziladi yoki hech biri
        var b = env.db().batch();
        docs.forEach(function(dc){ b.set(r.doc(dc.id), Object.assign({}, dc.x, umumiy)); });
        p = b.commit();
      }
    }catch(err){ xato = 'yozilmadi'; holatYangila(); if(env.xatoLog) env.xatoLog(err); return; }
    p.catch(function(err){
      // qayta yuborilgan yozuv allaqachon cloudda bo'lsa qoida rad etadi — bu xato emas
      r.doc(docs[0].id).get({ source: 'server' }).then(function(s){ if(!s.exists){ xato = 'yozilmadi'; holatYangila(); } })
        .catch(function(){ xato = 'yozilmadi'; holatYangila(); });
      if(env.xatoLog) env.xatoLog(err);
    });
  }

  // ── OMBOR QULFI ──
  function chBelgila(n){   // n-qulfli amal ko'rildi. chK — 1..chK hammasi ko'rilgan
    if(!n || n <= meta.chK) return;
    meta.chOrt[n] = 1;
    while(meta.chOrt[meta.chK + 1]){ delete meta.chOrt[meta.chK + 1]; meta.chK++; }
  }
  // Yozuv navbat raqami bilan BITTA tranzaksiyada. Qurilma hamma oldingi qulfli amalni ko'rmagan bo'lsa — 'orqada'
  // (hech narsa yozilmaydi). Natija — olingan raqam.
  function talonYoz(e, c){
    var db = env.db(), r = ref(), bosh = navbatRef();
    if(!db || !r) return Promise.reject(new Error('cloud'));
    var umumiy = { q: e.q, v: e.v, iz: e.iz, ts: e.ts, ol: 1 }, docs = hujjatlar(e);
    return db.runTransaction(function(tx){
      return tx.get(bosh).then(function(s){
        var n = s.exists ? (s.data().n || 0) : 0;
        if(n !== meta.chK){ var x = new Error('orqada'); x.n = n; throw x; }
        var t = env.serverVaqt();
        tx.set(bosh, { n: n + 1, y: docs[0].id, t: t });
        docs.forEach(function(dc, j){ tx.set(r.doc(dc.id), Object.assign(j ? {} : { ch: n + 1 }, dc.x, umumiy, { t: t })); });
        if(c) c.yuborildi = true;
        return n + 1;
      });
    });
  }
  function qulfli(izoh, qur){
    return new Promise(function(ok, yoq){
      if(cj) return yoq(xabar('band'));                     // bir vaqtda bitta qulfli amal
      cj = { izoh: izoh, qur: qur, ok: ok, yoq: yoq, bufer: [], urinish: 0, kut: false };
      if(!ref() || !unsub || !serverdan || xato === 'tinglash') return cjTugat('internet');
      if(env.kutish) env.kutish('Cloud tekshirmoqda…');
      if(meta.chiqish.length) cjKut('navbat'); else cjUrin();
    });
  }
  function cjUrin(){
    var c = cj, yoz;
    c.kut = false; c.yuborildi = false;
    try{ yoz = c.qur(baza); }catch(err){ return cjTugat('xato', 0, err); }   // amal HOZIRGI holatdan quriladi
    if(yoz && yoz.rad) return cjTugat(yoz.rad);
    try{ c.ops = opsHisobla(H, yoz, tashla); }catch(err){ return cjTugat('xato', 0, err); }
    if(!c.ops.length) return cjTugat(null, 0);
    c.e = yozuv(c.izoh, c.ops);
    talonYoz(c.e, c).then(function(n){ if(cj === c) cjTugat(null, n); }, function(err){
      if(cj !== c) return;
      if(err && err.message === 'orqada') return cjKut('orqada', err.n);
      if(err && err.code === 'permission-denied'){   // bir vaqtdagi to'qnashuv ham shunday kelishi mumkin — navbatga qaraymiz
        var b = navbatRef(); if(!b) return cjTugat('rad', 0, err);
        b.get({ source: 'server' }).then(function(s){
          if(cj !== c) return;
          var n = s.exists ? (s.data().n || 0) : 0;
          if(n !== meta.chK) cjKut('orqada', n);
          else if(!c.radQayta){ c.radQayta = 1; cjUrin(); }
          else cjTugat('rad', 0, err);
        }, function(){ if(cj === c) cjTugat('rad', 0, err); });
        return;
      }
      if(!c.yuborildi) return cjTugat('internet', 0, err);   // cloudga yetmadi — hech narsa yozilmagan
      cjNomalum();
    });
  }
  // Kutish — kelgan yozuvlar odatdagidek qo'llanadi, keyin amal QAYTA quriladi (foydalanuvchi qayta bosmaydi):
  //  'orqada' — boshqa telefon hozirgina qulfli amal qildi, bu telefon hali olmagan;
  //  'navbat' — shu telefonning oldingi yozuvlari hali cloudga yetmagan.
  function cjKut(sabab, n){
    var c = cj;
    if(++c.urinish > 5) return cjTugat('band');
    c.kut = true;
    var b = c.bufer; c.bufer = []; if(b.length) qabul(b);
    var t0 = Date.now(), soraldi = false;
    (function tekshir(){
      if(cj !== c) return;
      var o = Date.now() - t0;
      if(sabab === 'navbat'){
        if(!meta.chiqish.length) return cjUrin();
        if(!unsub || !serverdan) return cjTugat('internet');
        if(o > V.navbat) return cjTugat('navbat');
      } else {
        if(meta.chK >= n || o > V.orqada) return cjUrin();
        if(!soraldi && o > V.sora){ soraldi = true; yetkaz(); }   // tinglovchi kechiksa — o'zimiz so'raymiz
      }
      setTimeout(tekshir, V.qadam);
    })();
  }
  // Javob yo'qoldi — yozuv cloudga tushdimi, aniqlanmaguncha kutiladi (bitta sotuv ikki marta yozilmasin)
  function cjNomalum(){
    var c = cj, id0 = hujjatlar(c.e)[0].id;
    if(env.kutish) env.kutish('Internet uzildi. Saqlandimi — aniqlanmoqda…');
    (function sora(){
      if(cj !== c) return;
      var r = ref(); if(!r) return void setTimeout(sora, V.nomalum);
      r.doc(id0).get({ source: 'server' }).then(function(s){
        if(cj !== c) return;
        if(s.exists) cjTugat(null, s.data().ch); else cjTugat('internet');
      }, function(){ setTimeout(sora, V.nomalum); });
    })();
  }
  function cjTugat(sabab, n, asl){
    var c = cj; if(!c) return;
    cj = null;
    if(!sabab && c.ops && c.ops.length){            // O'TDI — endi bu kutilayotgan o'z yozuvim
      if(n) chBelgila(n);
      c.e.lokal = 1; kutish[c.e.id] = c.e; belgila(c.e, +1);
      meta.yetim += qolla(baza, H, c.ops);
      lokalYoz();
      if(env.yangilandi) env.yangilandi(baza);
    }
    var b = c.bufer; c.bufer = [];
    if(b.length) qabul(b);
    if(env.kutish) env.kutish(null);
    holatYangila();
    if(sabab) c.yoq(xabar(sabab, asl));
    else c.ok(c.ops ? c.ops.length : 0);
  }
  // Tinglovchi kechiksa — ko'rilmagan qulfli amallar (bo'laklari bilan) to'g'ridan-to'g'ri so'raladi
  function yetkaz(){
    var r = ref(); if(!r) return;
    function ol(s, list){ s.forEach(function(doc){ var x = doc.data({ serverTimestamps: 'none' }); if(x.t) list.push({ id: doc.id, x: x, t: x.t.toMillis() }); }); }
    r.where('ch', '>', meta.chK).get({ source: 'server' }).then(function(s){
      var list = []; ol(s, list);
      return Promise.all(list.filter(function(it){ return it.x.g; }).map(function(it){
        return r.where('g', '==', it.x.g).get({ source: 'server' }).then(function(s2){ ol(s2, list); });
      })).then(function(){ if(!list.length) return; if(cj && !cj.kut) cj.bufer.push.apply(cj.bufer, list); else qabul(list); holatYangila(); });
    }).catch(function(e){ if(env.xatoLog) env.xatoLog(e); });
  }

  // TINGLASH — daftarning oxirgi ko'rilgandan keyingi qismi
  function ulan(){
    if(!boshlandi) boshla();
    var r = ref(); if(!r || unsub) return;
    serverdan = false; xato = ''; holatYangila();
    var q = meta.oxirgiT ? r.where('t', '>=', env.vaqtDan(meta.oxirgiT - USTMA)).orderBy('t') : r.orderBy('t');
    unsub = q.onSnapshot({ includeMetadataChanges: true }, function(snap){
      var yangi = [];
      snap.docChanges().forEach(function(ch){
        if(ch.type === 'removed') return;
        var x = ch.doc.data({ serverTimestamps: 'none' });
        if(!x.t) return;                               // cloud hali tasdiqlamagan
        yangi.push({ id: ch.doc.id, x: x, t: x.t.toMillis() });
      });
      if(cj && !cj.kut) cj.bufer.push.apply(cj.bufer, yangi); else qabul(yangi);   // qulfli amal kutilmoqda — keyin
      serverdan = !snap.metadata.fromCache;
      holatYangila();
    }, function(err){ xato = 'tinglash'; holatYangila(); if(env.xatoLog) env.xatoLog(err); });
    // navbatda qolgan o'z yozuvlarim — yaratilgan TARTIBDA. Allaqachon yetib borganini cloud rad etadi (zarari yo'q).
    // (Tilla saboqi: forEach(yubor) emas — forEach indeksni ikkinchi argument qilib beradi.)
    meta.chiqish.slice().forEach(function(e){ yubor(e); });
  }
  function uzil(){ if(unsub){ try{ unsub(); }catch(e){} unsub = null; } serverdan = false; holatYangila(); }
  function qaytaYubor(){ xato = ''; meta.chiqish.slice().forEach(function(e){ yubor(e); }); holatYangila(); }

  function qabul(list){
    if(!list.length) return;
    var tayyor = [];
    list.forEach(function(it){                          // bo'laklarni yig'amiz
      if(it.x.g){
        var g = it.x.g;
        if(meta.korildi[g] !== undefined && !kutish[g]) return;   // allaqachon qo'llangan (qayta kelgan bo'lak)
        var b = bolaklar[g] || (bolaklar[g] = { n: it.x.n, q: {}, t: it.t, x: it.x });
        b.q[it.x.i] = it.x.o; b.t = Math.min(b.t, it.t); if(it.x.ch) b.ch = it.x.ch;   // navbat raqami faqat 0-bo'lakda
        if(Object.keys(b.q).length === b.n){
          var o = ''; for(var i = 0; i < b.n; i++) o += b.q[i];
          tayyor.push({ id: g, t: b.t, x: Object.assign({}, b.x, { o: o, ch: b.ch }) }); delete bolaklar[g];
        }
      } else tayyor.push(it);
    });
    tayyor.sort(function(a, b){ return a.t - b.t || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
    var ozgardi = false, kt = meta.kt;
    // Har kalitda cloud vaqti bo'yicha KEYINGI qiymat qoladi. Cloud yozuvlarni har doim tartib bilan yetkazmaydi —
    // shuning uchun har kalit qaysi yozuvdan kelganini [t, id] bilan eslab qolamiz.
    tayyor.forEach(function(it){
      if(it.t > meta.oxirgiT) meta.oxirgiT = it.t;
      if(env.izla) env.izla(kutish[it.id] ? 'oz' : meta.korildi[it.id] !== undefined ? 'skip' : 'boshqa', it.id);
      if(meta.korildi[it.id] !== undefined && !kutish[it.id]) return;   // allaqachon qo'llangan
      meta.korildi[it.id] = it.t;
      if(it.x.ch) chBelgila(it.x.ch);
      if(meta.chiqish.length) meta.chiqish = meta.chiqish.filter(function(c){ return c.id !== it.id; });
      var ops = JSON.parse(it.x.o), ver = [it.t, it.id];
      if(kutish[it.id]){                                // O'ZIMNIKI tasdiqlandi
        var e = kutish[it.id]; delete kutish[it.id]; belgila(e, -1);
        if(!meta.chiqish.length && xato === 'yozilmadi') xato = '';
        ops.forEach(function(op){ var o = oxirgiOz[op[1]]; if(!o || keyin(ver, o.v)) oxirgiOz[op[1]] = { v: ver, op: op }; });
        // Kalit endi kutilmayapti → cloud tartibidagi ENG KEYINGI qiymat qoladi: soyadagi boshqa telefonniki yoki
        // o'zimning eng keyingi tasdiqlangan yozuvim. (Tilla'da faqat soya tekshirilgan: o'z yozuvlarim cloudda boshqa
        // tartibda tushsa — masalan, biri rad etilib qayta yuborilsa — telefon boshqa qiymatda qolib ketardi.)
        var qayta = [];
        ops.forEach(function(op){
          var k = op[1];
          if(kalitKutish[k] || !oxirgiOz[k]) return;
          var oz = oxirgiOz[k], sy = soya[k], g = sy && keyin(sy.v, oz.v) ? sy : oz;
          if(g.op[0] === 's' ? H.m[k] !== g.op[2] : H.m[k] !== undefined) qayta.push(g.op);
          kt[k] = g.v;
          delete soya[k]; delete oxirgiOz[k];
        });
        if(qayta.length){ meta.yetim += qolla(baza, H, qayta); ozgardi = true; }
        return;
      }
      var hozir = [];                                   // BOSHQA TELEFON yozuvi
      ops.forEach(function(op){
        var k = op[1];
        if(kalitKutish[k]){ if(!soya[k] || keyin(ver, soya[k].v)) soya[k] = { v: ver, op: op }; return; }
        if(kt[k] && !keyin(ver, kt[k])){ tartibsiz++; return; }   // bizda keyinroq qiymat bor
        kt[k] = ver; hozir.push(op);
      });
      if(hozir.length){ meta.yetim += qolla(baza, H, hozir); ozgardi = true; }
    });
    if(ozgardi){ lokalYoz(); if(env.yangilandi) env.yangilandi(baza); }
    else metaSaqla();
  }

  // Cloud daftarini boshidan o'qib, alohida (bo'sh holat ustiga) quradi → { m: yassi holat, baza, yozuv: soni }
  function quril(){
    var r = ref(); if(!r) return Promise.reject(new Error('cloud'));
    return r.get({ source: 'server' }).then(function(snap){
      var bol = {}, list = [];
      snap.forEach(function(doc){
        var x = doc.data({ serverTimestamps: 'none' }); if(!x.t) return;
        var t = x.t.toMillis();
        if(x.g){ var b = bol[x.g] || (bol[x.g] = { n: x.n, q: {}, t: t }); b.q[x.i] = x.o; b.t = Math.min(b.t, t); }
        else list.push({ id: doc.id, t: t, o: x.o });
      });
      Object.keys(bol).forEach(function(g){
        var b = bol[g], o = ''; if(Object.keys(b.q).length !== b.n) return;
        for(var i = 0; i < b.n; i++) o += b.q[i];
        list.push({ id: g, t: b.t, o: o });
      });
      list.sort(function(a, b){ return a.t - b.t || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
      var bz = bosh(), h = Holat({});
      list.forEach(function(it){ qolla(bz, h, JSON.parse(it.o)); });
      return { m: h.m, baza: bz, yozuv: list.length };
    });
  }
  // TEKSHIRISH — daftar clouddan BOSHIDAN o'qiladi, alohida quriladi va shu telefon holati bilan solishtiriladi
  function tekshir(){
    return quril().then(function(q){
      var m = q.m, bu = H.m, farqlar = [], k;
      for(k in bu) if(bu[k] !== m[k]) farqlar.push(k);
      for(k in m) if(bu[k] === undefined) farqlar.push(k);
      return { ok: !farqlar.length, yozuv: q.yozuv, kalit: Object.keys(m).length, farq: farqlar.slice(0, 20), farqSoni: farqlar.length };
    });
  }
  // KO'CHIRISH — butun holatni berilgan hujjatlarga keltiradi ({ products: [hujjat, …], … } — Firestore'dan o'qilgani
  // kabi): farq BITTA katta yozuv bo'lib daftarga qo'shiladi (bo'laklab, navbat raqami bilan). Faqat internet bilan,
  // navbat bo'sh bo'lsa; holat cloud tasdiqlagandan KEYIN almashadi.
  function kochir(royxatlar, izoh){
    if(!boshlandi) boshla();
    if(!ref() || !unsub || !serverdan || meta.chiqish.length || cj) return Promise.reject(xabar('internet'));
    return quril().then(function(q){
      var yangiM = yassi(bazaDan(royxatlar, tashla), tashla), ops = farq(q.m, yangiM);
      function almashtir(){
        baza = bosh(); H = Holat({}); qolla(baza, H, farq({}, yangiM));
        lokalYoz(); holatYangila(); if(env.yangilandi) env.yangilandi(baza);
        return ops.length;
      }
      if(!ops.length) return almashtir();
      var e = yozuv(izoh || 'Ko\'chirish', ops);
      kutish[e.id] = e; belgila(e, +1);
      return talonYoz(e).then(function(n){ chBelgila(n); e.lokal = 1; return almashtir(); },
        function(err){ delete kutish[e.id]; belgila(e, -1); holatYangila(); throw err; });
    });
  }

  function holatYangila(){
    if(!env.holat || !meta) return;
    var n = meta.chiqish.length;
    if(xato) env.holat('red', xato === 'tinglash' ? 'daftar o\'qilmadi' : xato === 'joy' ? 'qurilmada joy yetmadi' : 'yozilmadi');
    else if(!unsub) env.holat('gray', 'ulanmagan');
    else if(!serverdan) env.holat('yellow', 'tekshirilmoqda');
    else if(n) env.holat('yellow', 'yuborilmoqda · ' + n);
    else if(Object.keys(bolaklar).length) env.holat('yellow', 'o\'qilmoqda');
    else env.holat('green', 'daftar bilan 1:1');
  }

  return {
    boshla: boshla, amal: amal, ulan: ulan, uzil: uzil, qaytaYubor: qaytaYubor, tekshir: tekshir, kochir: kochir, quril: quril,
    holat: function(){ return baza; },
    tayyor: function(){ return !!(unsub && serverdan && !xato && meta && !meta.chiqish.length && !cj); },
    navbatda: function(){ return meta ? meta.chiqish.length : 0; },
    tashlandi: function(){ return Object.assign({}, tashlandi); },
    _ichki: function(){ return { H: H, meta: meta, kutish: kutish, kalitKutish: kalitKutish, soya: soya, serverdan: serverdan, xato: xato, tartibsiz: tartibsiz, cj: cj }; }
  };
}

var DF = { DAFTAR_VER: DAFTAR_VER, MAYDON: MAYDON, MASSIV: MASSIV, BOLAK: BOLAK, bosh: bosh, bazaDan: bazaDan, yassi: yassi,
           farq: farq, Holat: Holat, qolla: qolla, opsHisobla: opsHisobla, Daftar: Daftar, yangiId: yangiId, imzo: imzo };
if(typeof module !== 'undefined' && module.exports) module.exports = DF;
else root.DF = DF;
})(this);
