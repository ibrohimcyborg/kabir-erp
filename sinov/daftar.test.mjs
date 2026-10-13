// daftar.js sinovlari — `node sinov/daftar.test.mjs` (repo ildizidan). Haqiqiy Firebase'ga ulanmaydi:
// soxta-firestore.mjs dagi xotiradagi «cloud» va «telefonlar» ishlatiladi. Ma'lumotlar soxta.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { soxtaServer, soxtaMijoz, serverVaqt, vaqtDan } from './soxta-firestore.mjs';
const DF = createRequire(import.meta.url)('../daftar.js');

// ── yordamchilar ──
const kut = ms => new Promise(r => setTimeout(r, ms));
async function kutGacha(shart, ms = 4000, nima = 'shart'){
  const t0 = Date.now();
  while(!shart()){ if(Date.now() - t0 > ms) throw new Error('kutilmadi: ' + nima); await kut(10); }
}
function kanon(x){
  if(Array.isArray(x)) return '[' + x.map(kanon).join(',') + ']';
  if(x && typeof x === 'object') return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + kanon(x[k])).join(',') + '}';
  return JSON.stringify(x);
}
function telefon(server, nom, xotira = { xom: null, meta: null }){
  const mijoz = soxtaMijoz(server, nom), holatlar = [], izlar = [];
  const env = {
    db: () => mijoz.db, kol: () => 'TEST_kabir', qurilma: () => nom, ver: 'sinov',
    serverVaqt, vaqtDan,
    xomOl: () => xotira.xom, lokalSaqla: j => { xotira.xom = j; },
    metaOl: () => xotira.meta ? JSON.parse(JSON.stringify(xotira.meta)) : null, metaYoz: m => { xotira.meta = m; },
    holat: (r, t) => holatlar.push(r + ' ' + t), yangilandi: () => {}, xatoLog: () => {},
    izla: (t, x) => izlar.push([t, x]),
    vaqt: { navbat: 800, orqada: 1200, sora: 200, nomalum: 30, qadam: 10 },
  };
  const d = DF.Daftar(env);
  return { d, mijoz, xotira, holatlar, izlar, nom, holat: () => holatlar[holatlar.length - 1] };
}
async function ulangan(...tlar){ tlar.forEach(t => t.d.ulan()); await kutGacha(() => tlar.every(t => t.d.tayyor()), 3000, 'ulanish'); }
async function birXil(...tlar){
  await kutGacha(() => tlar.every(t => t.d.tayyor()) && tlar.every(t => kanon(t.d.holat()) === kanon(tlar[0].d.holat())), 4000, 'telefonlar bir xil');
}
async function tekshirOk(t){ const r = await t.d.tekshir(); assert.equal(r.ok, true, t.nom + ' tekshir: ' + JSON.stringify(r.farq)); return r; }
const yozuvlarSoni = s => [...s.hujjatlar.keys()].filter(k => k.includes('/_daftar/yozuvlar/')).length;

// Soxta boshlang'ich ma'lumot (Firestore'dagi kabi: snake_case + holatdan tushgan camelCase «axlat»)
function soxtaBaza(nUnit = 3){
  return {
    products: [{ id: 'p1', name: 'Divan Milano', sku: 'DV014', category: 'divan', dimensions: '2x1', cost: 300, price: 520, markup: 30,
      cost_items: [{ id: 'c1', name: 'MDF', amount: 300 }], price_incomplete: false, image: 'data:image/jpeg;base64,AAAA',
      created_at: '2026-09-01T00:00:00.000Z', costItems: [{ id: 'c1' }], priceIncomplete: false }],
    units: Array.from({ length: nUnit }, (_, i) => ({ id: 'u' + (i + 1), unit_id: 'DV014-#' + String(i + 1).padStart(4, '0'), product_id: 'p1',
      location: 's1', status: 'available', added_at: '2026-09-02T00:00:00.000Z', sent_at: '2026-09-03T00:00:00.000Z', unitId: 'DV014-#' + String(i + 1).padStart(4, '0') })),
    stores: [{ id: 's1', name: 'Do\'kon A', address: 'Manzil', manager: 'Menejer', phone: '+998900000000', created_at: '2026-09-01T00:00:00.000Z' },
             { id: 's2', name: 'Do\'kon B', address: '', manager: '', phone: '', created_at: '2026-09-01T00:00:00.000Z' }],
    sales: [{ id: 'sa1', unit_ids: ['DV014-#9999'], store_id: 's1', product_id: 'p1', customer_id: 'c1', customer_name: 'Mijoz A', qty: 1, price: 520,
      cost: 300, total_amount: 520, paid: false, pay_date: null, pay_method: null, debt_due: null, date: '2026-09-05', created_at: '2026-09-05T00:00:00.000Z',
      partial_payments: [{ id: 'pp1', amount: 100, method: 'cash', date: '2026-09-06' }, { id: 'pp2', amount: 50, method: 'card', date: '2026-09-07' }],
      unitIds: ['x'], totalAmount: 520 }],
    orders: [{ id: 'o1', order_id: 'ZK-0001', store_id: 's1', product_id: 'p1', qty: 1, note: '', deadline: '2026-10-20', price: 600, prepaid: 100,
      status: 'working', status_history: [{ status: 'pending', time: '2026-09-10T10:00:00.000Z' }, { status: 'working', time: '2026-09-11T10:00:00.000Z' }],
      created_at: '2026-09-10T10:00:00.000Z', statusHistory: [] }],
    customers: [{ id: 'c1', name: 'Mijoz A', phone: '+998900000001', created_at: '2026-09-05T00:00:00.000Z' }],
    activity: [{ id: 'a1', action: 'Sotildi', details: 'Divan Milano 1 dona', time: '2026-09-05T00:00:00.000Z' }],
  };
}
async function boshlanganIkki(){
  const server = soxtaServer(), A = telefon(server, 'A'), B = telefon(server, 'B');
  await ulangan(A, B);
  await A.d.kochir(soxtaBaza(), 'boshlang\'ich');
  await birXil(A, B);
  return { server, A, B };
}

// ── sinovlar ──
const sinovlar = [];
const sinov = (nom, fn) => sinovlar.push({ nom, fn });

sinov('yassi: Kabir kalitlari, faqat ro\'yxatdagi maydonlar', () => {
  const tash = {};
  const m = DF.yassi(DF.bazaDan(soxtaBaza()), (j, f) => { tash[j + '.' + f] = (tash[j + '.' + f] || 0) + 1; });
  assert.equal(m['units:u1'], '1');
  assert.equal(m['units:u1.location'], '"s1"');
  assert.equal(m['sales:sa1.partial_payments'], '1');
  assert.equal(JSON.parse(m['sales:sa1.pp:pp2']).amount, 50);
  assert.equal(m['orders:o1.status_history'], '1');
  assert.equal(JSON.parse(m['orders:o1.sh:2026-09-11T10:00:00.000Z~1']).status, 'working');
  assert.equal(m['activity:a1.action'], '"Sotildi"');
  assert.ok(!Object.keys(m).some(k => /image|unitId|costItems|priceIncomplete|totalAmount|statusHistory/.test(k)), 'axlat kalit yo\'q');
  for(const k of ['products.image', 'products.costItems', 'units.unitId', 'sales.unitIds', 'sales.totalAmount', 'orders.statusHistory'])
    assert.ok(tash[k] > 0, k + ' tashlandi');
});

sinov('qolla: yassidan qayta qurilgan holat asl hujjatlarga teng', () => {
  const asl = DF.bazaDan(soxtaBaza()), m = DF.yassi(asl);
  const b = DF.bosh(), H = DF.Holat({});
  assert.equal(DF.qolla(b, H, DF.farq({}, m)), 0);
  assert.equal(kanon(DF.yassi(b)), kanon(m));
  assert.deepEqual(b.sales.sa1.partial_payments.map(p => p.id), ['pp1', 'pp2']);
  assert.deepEqual(b.orders.o1.status_history.map(x => x.status), ['pending', 'working']);
  assert.equal(b.products.p1.image, undefined);
  assert.equal(b.units.u1.id, 'u1');
});

sinov('opsHisobla: insert/upsert/update/delete hozirgi Firestore o\'rami kabi', () => {
  const b = DF.bazaDan(soxtaBaza()), H = DF.Holat(DF.yassi(b));
  // insert — hujjat to'liq almashadi (kelmagan maydon o'chadi)
  let ops = DF.opsHisobla(H, [{ t: 'insert', j: 'units', r: { id: 'u1', unit_id: 'DV014-#0001', product_id: 'p1', location: 'warehouse', status: 'available' } }]);
  assert.deepEqual(ops.filter(o => o[0] === 'd').map(o => o[1]).sort(), ['units:u1.added_at', 'units:u1.sent_at']);
  assert.ok(ops.some(o => o[1] === 'units:u1.location' && o[2] === '"warehouse"'));
  // upsert — faqat kelgan maydonlar; massiv butunligicha almashadi (PayModal: ...sale spread bilan)
  const sale = b.sales.sa1;
  ops = DF.opsHisobla(H, [{ t: 'upsert', j: 'sales', r: { ...sale, unitIds: ['x'], storeId: 's1',
    partial_payments: [sale.partial_payments[0], { id: 'pp3', amount: 370, method: 'cash', date: '2026-10-01' }], paid: true, pay_date: '2026-10-01' } }]);
  assert.deepEqual(ops.map(o => o[0] + ' ' + o[1]).sort(),
    ['d sales:sa1.pp:pp2', 's sales:sa1.paid', 's sales:sa1.pay_date', 's sales:sa1.pp:pp3']);
  // update — yo'q hujjatga hech narsa; bor hujjatda maydonlar
  assert.deepEqual(DF.opsHisobla(H, [{ t: 'update', j: 'orders', id: 'yoq', f: { status: 'ready' } }]), []);
  ops = DF.opsHisobla(H, [{ t: 'update', j: 'orders', id: 'o1', f: { status: 'ready', status_history: [...b.orders.o1.status_history, { status: 'ready', time: '2026-10-12T09:00:00.000Z' }] } }]);
  assert.deepEqual(ops.map(o => o[1]).sort(), ['orders:o1.sh:2026-10-12T09:00:00.000Z~1', 'orders:o1.status']);
  // delete — hujjatning hamma kaliti
  ops = DF.opsHisobla(H, [{ t: 'delete', j: 'units', id: ['u1', 'u2'] }]);
  assert.equal(ops.length, 14); assert.ok(ops.every(o => o[0] === 'd'));
  // bitta amal ichida: insert, keyin upsert — sof natija
  ops = DF.opsHisobla(H, [{ t: 'insert', j: 'stores', r: { id: 's9', name: 'Yangi', phone: '' } }, { t: 'upsert', j: 'stores', r: { id: 's9', phone: '+998' } }]);
  assert.deepEqual(ops.map(o => o[1] + '=' + o[2]).sort(), ['stores:s9.name="Yangi"', 'stores:s9.phone="+998"', 'stores:s9=1']);
  // noto'g'ri jadval/id — xato
  assert.throws(() => DF.opsHisobla(H, [{ t: 'insert', j: 'users', r: { id: 'x' } }]));
  assert.throws(() => DF.opsHisobla(H, [{ t: 'insert', j: 'units', r: { location: 's1' } }]));
});

sinov('qolla: hujjati yo\'q maydon — egasiz (yetim) sanaladi', () => {
  const b = DF.bosh(), H = DF.Holat({});
  assert.equal(DF.qolla(b, H, [['s', 'stores:s1.name', '"X"']]), 1);
  assert.equal(b.stores.s1, undefined);
});

sinov('ikki telefon turli maydonni o\'zgartiradi — ikkalasi ham saqlanadi', async () => {
  const { A, B } = await boshlanganIkki();
  await Promise.all([
    A.d.amal('Do\'kon tahrirlandi', () => [{ t: 'update', j: 'stores', id: 's1', f: { name: 'Do\'kon A2' } }]),
    B.d.amal('Do\'kon tahrirlandi', () => [{ t: 'update', j: 'stores', id: 's1', f: { phone: '+998911111111' } }]),
  ]);
  await birXil(A, B);
  assert.equal(A.d.holat().stores.s1.name, 'Do\'kon A2');
  assert.equal(A.d.holat().stores.s1.phone, '+998911111111');
  await tekshirOk(A); await tekshirOk(B);
});

sinov('bitta maydon — cloud vaqti bo\'yicha keyingisi yutadi, kechikkan telefonda ham', async () => {
  const { server, A, B } = await boshlanganIkki();
  A.mijoz.kechikish = 60;   // A ga xabarlar kech yetadi
  await A.d.amal('t', () => [{ t: 'update', j: 'stores', id: 's1', f: { name: 'A nomi' } }]);
  await kut(5);
  await B.d.amal('t', () => [{ t: 'update', j: 'stores', id: 's1', f: { name: 'B nomi' } }]);
  await birXil(A, B);
  const yoz = [...server.hujjatlar].filter(([k]) => k.includes('/yozuvlar/')).map(([, h]) => h.data).sort((a, b) => a.t.toMillis() - b.t.toMillis());
  const oxirgi = JSON.parse(yoz[yoz.length - 1].o).find(o => o[1] === 'stores:s1.name');
  assert.equal(A.d.holat().stores.s1.name, JSON.parse(oxirgi[2]));
  await tekshirOk(A); await tekshirOk(B);
});

sinov('internetsiz qulfsiz amallar navbatda turadi va TARTIB bilan ketadi', async () => {
  const { server, A, B } = await boshlanganIkki();
  A.mijoz.offlayn(); await kut(20);
  for(const n of [1, 2, 3]) await A.d.amal('To\'lov', () => [{ t: 'update', j: 'stores', id: 's2', f: { phone: 'tel-' + n } }]);
  assert.equal(A.d.navbatda(), 3);
  assert.equal(A.d.holat().stores.s2.phone, 'tel-3');                // telefonda darhol ko'rinadi
  assert.equal(B.d.holat().stores.s2.phone, '');
  A.mijoz.onlayn();
  await birXil(A, B);
  assert.equal(B.d.holat().stores.s2.phone, 'tel-3');
  const t = [...server.hujjatlar].filter(([k]) => k.includes('/yozuvlar/')).map(([, h]) => h.data).filter(x => x.iz === 'To\'lov')
    .sort((a, b) => a.t.toMillis() - b.t.toMillis()).map(x => JSON.parse(x.o)[0][2]);
  assert.deepEqual(t, ['"tel-1"', '"tel-2"', '"tel-3"']);
  await tekshirOk(B);
});

sinov('Tilla saboqi: navbatda 3 ta, 2-chisi rad — xato ko\'rinadi, qolganlari ketadi', async () => {
  const { server, A, B } = await boshlanganIkki();
  A.mijoz.offlayn(); await kut(20);
  for(const n of [1, 2, 3]) await A.d.amal('n' + n, () => [{ t: 'update', j: 'customers', id: 'c1', f: { phone: 'p' + n } }]);
  const ids = A.d._ichki().meta.chiqish.map(e => e.id);
  server.radEt.add(ids[1]);
  A.mijoz.onlayn();
  await kutGacha(() => A.holat() === 'red yozilmadi', 3000, 'xato ko\'rinishi');
  assert.ok(server.hujjatlar.has('TEST_kabir/_daftar/yozuvlar/' + ids[0]));
  assert.ok(!server.hujjatlar.has('TEST_kabir/_daftar/yozuvlar/' + ids[1]));
  assert.ok(server.hujjatlar.has('TEST_kabir/_daftar/yozuvlar/' + ids[2]));
  server.radEt.clear();
  A.d.qaytaYubor();
  await birXil(A, B);
  assert.equal(A.holat(), 'green daftar bilan 1:1');
  await tekshirOk(A); await tekshirOk(B);
});

sinov('katta yozuv bo\'laklarga bo\'linadi, bitta batch, boshqa telefonda yig\'iladi', async () => {
  const { server, A, B } = await boshlanganIkki();
  B.mijoz.offlayn(); await kut(20);
  const katta = 'x'.repeat(DF.BOLAK * 2 + 10);
  await A.d.amal('katta', () => [{ t: 'insert', j: 'activity', r: { id: 'a-katta', action: 'Sinov', details: katta, time: '2026-10-13T00:00:00.000Z' } }]);
  await kutGacha(() => A.d.tayyor(), 3000, 'A tayyor');
  const bolak = [...server.hujjatlar.keys()].filter(k => /yozuvlar\/y[^/]*~\d+$/.test(k));
  assert.equal(bolak.length, 3);
  B.mijoz.onlayn();
  await birXil(A, B);
  assert.equal(B.d.holat().activity['a-katta'].details.length, katta.length);
  const amallar = new Set([...server.hujjatlar.keys()].filter(k => k.includes('/_daftar/yozuvlar/')).map(k => k.replace(/~\d+$/, ''))).size;
  assert.equal(A.d.jami(), amallar); assert.equal(B.d.jami(), amallar);   // bo'laklangan yozuv — bitta amal
  await tekshirOk(B);
});

sinov('imzo: butun lokal nusxa qayta ishlatiladi, o\'zgartirilgani — daftardan qayta quriladi', async () => {
  const { server, A } = await boshlanganIkki();
  await A.d.amal('t', () => [{ t: 'update', j: 'stores', id: 's1', f: { address: 'Yangi manzil' } }]);
  await kutGacha(() => A.d.tayyor());
  A.d.uzil();
  const A2 = telefon(server, 'A', A.xotira); A2.d.boshla();
  assert.deepEqual(A2.izlar.find(x => x[0] === 'boshla')[1].qayta, false);
  assert.equal(A2.d.holat().stores.s1.address, 'Yangi manzil');
  A2.d.uzil();
  A.xotira.xom = A.xotira.xom.replace('Yangi manzil', 'Buzilgan');   // qo'lda o'zgartirilgan nusxa
  const A3 = telefon(server, 'A', A.xotira); A3.d.boshla();
  assert.deepEqual(A3.izlar.find(x => x[0] === 'boshla')[1].qayta, true);
  assert.equal(Object.keys(A3.d.holat().stores).length, 0);
  await ulangan(A3);
  await kutGacha(() => A3.d.holat().stores.s1 && A3.d.holat().stores.s1.address === 'Yangi manzil', 3000, 'qayta qurildi');
  await tekshirOk(A3);
});

sinov('qayta ochilganda navbatdagi amal bir marta ketadi', async () => {
  const { server, A, B } = await boshlanganIkki();
  A.mijoz.offlayn(); await kut(20);
  await A.d.amal('offlayn', () => [{ t: 'update', j: 'stores', id: 's2', f: { manager: 'Yangi' } }]);
  const id = A.d._ichki().meta.chiqish[0].id;
  A.d.uzil();
  const A2 = telefon(server, 'A', A.xotira);   // ilova yopilib qayta ochildi (Firestore'ning o'z navbati yo'qolgan)
  await ulangan(A2);
  await birXil(A2, B);
  assert.equal(B.d.holat().stores.s2.manager, 'Yangi');
  assert.equal([...server.hujjatlar.keys()].filter(k => k.endsWith('/' + id)).length, 1);
  await tekshirOk(A2);
});

// qulfli sotuv: mol shu do'konda va sotilmagan bo'lsa — sotiladi
const sotish = (uid, sid) => baza => {
  const u = baza.units[uid];
  if(!u || u.status !== 'available') return { rad: 'sotilgan' };
  return [{ t: 'upsert', j: 'units', r: { id: uid, status: 'sold' } },
          { t: 'insert', j: 'sales', r: { id: sid, unit_ids: [u.unit_id], store_id: u.location, product_id: u.product_id, qty: 1, total_amount: 520, paid: true, partial_payments: [] } }];
};

sinov('ombor qulfi: bitta donani ikki telefon bir vaqtda sotsa — faqat bittasi o\'tadi', async () => {
  const { server, A, B } = await boshlanganIkki();
  const r = await Promise.allSettled([A.d.amal('Sotildi', sotish('u1', 'sA'), { qulf: true }), B.d.amal('Sotildi', sotish('u1', 'sB'), { qulf: true })]);
  assert.deepEqual(r.map(x => x.status).sort(), ['fulfilled', 'rejected']);
  assert.equal(r.find(x => x.status === 'rejected').reason.sabab, 'sotilgan');
  await birXil(A, B);
  const sotuvlar = Object.keys(A.d.holat().sales).filter(id => id === 'sA' || id === 'sB');
  assert.equal(sotuvlar.length, 1);
  assert.equal(server.hujjatlar.get('TEST_kabir/_daftar/navbat/bosh').data.n, 2);   // ko'chirish + 1 sotuv
  await tekshirOk(A); await tekshirOk(B);
});

sinov('ombor qulfi: ikki telefon bir vaqtda omborga qo\'shsa — unit ID takrorlanmaydi', async () => {
  const { A, B } = await boshlanganIkki();
  const qosh = (p, n) => baza => {
    const bor = Object.values(baza.units).filter(u => u.product_id === 'p1').length;
    return [{ t: 'insert', j: 'units', r: Array.from({ length: n }, (_, i) => ({ id: p + i, unit_id: 'DV014-#' + String(bor + i + 1).padStart(4, '0'), product_id: 'p1', location: 'warehouse', status: 'available' })) }];
  };
  const r = await Promise.allSettled([A.d.amal('Ombor', qosh('ua', 2), { qulf: true }), B.d.amal('Ombor', qosh('ub', 2), { qulf: true })]);
  assert.deepEqual(r.map(x => x.status), ['fulfilled', 'fulfilled']);
  await birXil(A, B);
  const idlar = Object.values(A.d.holat().units).map(u => u.unit_id);
  assert.equal(new Set(idlar).size, idlar.length, 'takror ID: ' + idlar.join(' '));
  assert.ok(idlar.includes('DV014-#0007'));
  await tekshirOk(A);
});

sinov('qulfli amal internetsiz saqlanmaydi', async () => {
  const { server, A } = await boshlanganIkki();
  const oldin = yozuvlarSoni(server), holat0 = kanon(A.d.holat());
  A.mijoz.offlayn(); await kut(20);
  await assert.rejects(A.d.amal('Sotildi', sotish('u2', 'sX'), { qulf: true }), e => e.sabab === 'internet');
  assert.equal(yozuvlarSoni(server), oldin);
  assert.equal(kanon(A.d.holat()), holat0);
});

sinov('javob yo\'qolsa — yozildimi tekshiriladi, ikki marta yozilmaydi', async () => {
  const { server, A, B } = await boshlanganIkki();
  const oldin = yozuvlarSoni(server);
  A.mijoz.javobYoqolsin = true;
  await A.d.amal('Sotildi', sotish('u3', 'sY'), { qulf: true });
  assert.equal(yozuvlarSoni(server), oldin + 1);
  await birXil(A, B);
  assert.equal(B.d.holat().units.u3.status, 'sold');
  await tekshirOk(A);
});

sinov('o\'z navbati bo\'shamaguncha qulfli amal kutadi, keyin o\'tadi', async () => {
  const { A, B } = await boshlanganIkki();
  A.mijoz.offlayn(); await kut(20);
  await A.d.amal('tahrir', () => [{ t: 'update', j: 'stores', id: 's1', f: { manager: 'M2' } }]);
  A.mijoz.onlayn();
  await kutGacha(() => A.d._ichki().serverdan, 2000, 'server');
  await A.d.amal('Sotildi', sotish('u1', 'sZ'), { qulf: true });
  await birXil(A, B);
  assert.equal(B.d.holat().stores.s1.manager, 'M2');
  assert.equal(B.d.holat().units.u1.status, 'sold');
});

sinov('ko\'chirish + tekshirish: katta baza bitta yozuvda, yangi telefon 1:1', async () => {
  const server = soxtaServer(), A = telefon(server, 'A');
  await ulangan(A);
  const katta = soxtaBaza(3000);
  await A.d.kochir(katta, 'Ko\'chirish');
  assert.ok([...server.hujjatlar.keys()].some(k => /~1$/.test(k)), 'bo\'laklangan');
  const B = telefon(server, 'B');
  await ulangan(B);
  await birXil(A, B);
  assert.equal(Object.keys(B.d.holat().units).length, 3000);
  assert.equal(B.d.holat().products.p1.image, undefined);
  const r = await tekshirOk(B);
  assert.equal(r.yozuv, 1);
  assert.ok(A.d.tashlandi()['units.unitId'] >= 3000);
});

sinov('qayta ulanganda oxirgi 5 daqiqa qayta keladi, lekin qayta qo\'llanmaydi', async () => {
  const { A, B } = await boshlanganIkki();
  A.d.uzil();
  await B.d.amal('b1', () => [{ t: 'update', j: 'stores', id: 's2', f: { address: 'X1' } }]);
  await B.d.amal('b2', () => [{ t: 'update', j: 'stores', id: 's2', f: { address: 'X2' } }]);
  A.izlar.length = 0;
  await ulangan(A);
  await birXil(A, B);
  assert.equal(A.d.holat().stores.s2.address, 'X2');
  assert.ok(A.izlar.some(x => x[0] === 'skip'), 'eski yozuvlar o\'tkazib yuborildi');
  await tekshirOk(A);
});

sinov('o\'chirilgan hujjatga kech kelgan tahrir — egasiz, ikki telefonda ham bir xil', async () => {
  const { A, B } = await boshlanganIkki();
  await Promise.all([
    A.d.amal('Do\'kon o\'chirildi', () => [{ t: 'delete', j: 'stores', id: 's2' }]),
    B.d.amal('Do\'kon tahrirlandi', () => [{ t: 'update', j: 'stores', id: 's2', f: { phone: '+998' } }]),
  ]);
  await birXil(A, B);
  assert.equal(A.d.holat().stores.s2, undefined);
  await tekshirOk(A); await tekshirOk(B);
});

// Tasodifiy sinov: 3 telefon, tasodifiy amallar, internet uzilib-ulanadi, xabarlar kechikadi.
// Oxirida: hammasi bir xil, cloud'dan qayta qurilgani bilan 1:1, bitta dona ikki marta sotilmagan, unit ID takrorlanmagan.
function tasodif(urug){ return () => { urug |= 0; urug = urug + 0x6D2B79F5 | 0; let t = Math.imul(urug ^ urug >>> 15, 1 | urug);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const URUGLAR = +process.env.URUGLAR || 6;   // ko'proq tekshirish: URUGLAR=50 node sinov/daftar.test.mjs
for(let urug = 1; urug <= URUGLAR; urug++){
  sinov('tasodifiy: 3 telefon, uzilishlar, kechikishlar (urug\' ' + urug + ')', async () => {
    const R = tasodif(urug), tanla = a => a[Math.floor(R() * a.length)];
    const server = soxtaServer(), T = ['A', 'B', 'C'].map(n => telefon(server, n));
    await ulangan(...T);
    await T[0].d.kochir(soxtaBaza(10), 'boshlang\'ich');
    await birXil(...T);
    const kutilgan = [], yig = p => { p.catch(() => {}); return p; };   // rad keyinroq tekshiriladi
    let n = 0;
    const qosh = p => baza => {
      const bor = Object.values(baza.units).filter(u => u.product_id === 'p1').length;
      return [{ t: 'insert', j: 'units', r: { id: p, unit_id: 'DV014-#' + String(bor + 1).padStart(4, '0'), product_id: 'p1', location: 's1', status: 'available' } }];
    };
    for(let qadam = 0; qadam < 45; qadam++){
      const t = tanla(T), r = R();
      if(r < 0.30) kutilgan.push(yig(t.d.amal('tahrir', () => [{ t: 'update', j: 'stores', id: tanla(['s1', 's2']), f: { [tanla(['name', 'phone', 'address'])]: t.nom + (n++) } }])));
      else if(r < 0.40) kutilgan.push(yig(t.d.amal('mijoz', () => [{ t: 'upsert', j: 'customers', r: { id: 'c1', phone: t.nom + (n++) } }])));
      else if(r < 0.62) kutilgan.push(yig(t.d.amal('Sotildi', sotish('u' + (1 + Math.floor(R() * 10)), 's-' + t.nom + (n++)), { qulf: true })));
      else if(r < 0.72) kutilgan.push(yig(t.d.amal('Ombor', qosh('n-' + t.nom + (n++)), { qulf: true })));
      else if(r < 0.84){ if(t.mijoz.online) t.mijoz.offlayn(); else t.mijoz.onlayn(); }
      else if(r < 0.92) t.mijoz.kechikish = Math.floor(R() * 40);
      else { t.d.uzil(); t.d.ulan(); }
      await kut(Math.floor(R() * 15));
    }
    T.forEach(t => { t.mijoz.kechikish = 0; if(!t.mijoz.online) t.mijoz.onlayn(); });
    const natija = await Promise.allSettled(kutilgan);
    const kutilmagan = natija.filter(x => x.status === 'rejected' && !['sotilgan', 'internet', 'band', 'navbat'].includes(x.reason.sabab));
    assert.equal(kutilmagan.length, 0, 'kutilmagan rad: ' + kutilmagan.map(x => x.reason.sabab || x.reason.message).join(', '));
    await kutGacha(() => T.every(t => t.d._ichki().serverdan), 3000, 'hammasi online');
    T.forEach(t => t.d.qaytaYubor());
    await birXil(...T);
    for(const t of T) await tekshirOk(t);
    const b = T[0].d.holat(), idlar = Object.values(b.units).map(u => u.unit_id);
    assert.equal(new Set(idlar).size, idlar.length, 'takror unit ID');
    const sotilgan = {};
    Object.values(b.sales).forEach(s => (s.unit_ids || []).forEach(u => { sotilgan[u] = (sotilgan[u] || 0) + 1; }));
    assert.ok(Object.values(sotilgan).every(k => k === 1), 'bitta dona ikki marta sotildi: ' + JSON.stringify(sotilgan));
    Object.values(b.units).forEach(u => { if(u.status === 'sold') assert.ok(sotilgan[u.unit_id] === 1, u.unit_id + ' sotilgan, lekin sotuv yo\'q'); });
  });
}

// ── ishga tushirish ──
let xatolar = 0;
for(const s of sinovlar){
  try{ await s.fn(); console.log('✓ ' + s.nom); }
  catch(e){ xatolar++; console.log('✗ ' + s.nom + '\n    ' + (e && e.stack || e).toString().split('\n').slice(0, 4).join('\n    ')); }
}
console.log(`\n${sinovlar.length - xatolar}/${sinovlar.length} o'tdi`);
process.exit(xatolar ? 1 : 0);
