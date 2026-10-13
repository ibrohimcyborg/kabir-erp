// firestore.rules sinovi — Firebase EMULYATORIDA (haqiqiy Firebase'ga ulanmaydi). Ilova ishlatadigan Firebase 10.14.1
// kutubxonasi bilan: qoidaning o'zi va daftar.js ning haqiqiy Firestore xulqi bilan ishlashi tekshiriladi.
//
// Tayyorlash (repo TASHQARISIDA, bir marta):
//   F=/tmp/kabir-fb; mkdir -p $F && cd $F && echo '{"private":true}' > package.json
//   npm i firebase@10.14.1 @firebase/rules-unit-testing@3.0.4
//   curl -sS -o emulator.jar https://storage.googleapis.com/firebase-preview-drop/emulator/cloud-firestore-emulator-v1.19.7.jar
// Ishga tushirish (repo ildizidan; Java kerak):  KABIR_FB=/tmp/kabir-fb node sinov/qoida.test.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const FB = process.env.KABIR_FB || '/tmp/kabir-fb';
if(!fs.existsSync(path.join(FB, 'emulator.jar')) || !fs.existsSync(path.join(FB, 'node_modules/firebase'))){
  console.error('Emulyator yoki kutubxonalar topilmadi: ' + FB + ' — fayl boshidagi «Tayyorlash» buyruqlarini bajaring.');
  process.exit(2);
}
const fbReq = createRequire(path.join(FB, 'package.json'));
const { initializeTestEnvironment, assertFails, assertSucceeds } = fbReq('@firebase/rules-unit-testing');
const fbApp = fbReq('firebase/compat/app'); const firebase = fbApp.default || fbApp; fbReq('firebase/compat/firestore');
firebase.firestore.setLogLevel('silent');   // assertFails kutilgan rad xabarlarini ekranga chiqarmasin
const DF = createRequire(import.meta.url)('../daftar.js');
const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));

const HOST = '127.0.0.1', PORT = 8181;
const kut = ms => new Promise(r => setTimeout(r, ms));
async function kutGacha(shart, ms = 8000, nima = 'shart'){
  const t0 = Date.now();
  while(!shart()){ if(Date.now() - t0 > ms) throw new Error('kutilmadi: ' + nima); await kut(20); }
}
function kanon(x){
  if(Array.isArray(x)) return '[' + x.map(kanon).join(',') + ']';
  if(x && typeof x === 'object') return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + kanon(x[k])).join(',') + '}';
  return JSON.stringify(x);
}

// ── emulyator ──
const emu = spawn('java', ['-jar', path.join(FB, 'emulator.jar'), '--host', HOST, '--port', String(PORT), '--project_id', 'kabir-sinov'],
  { stdio: ['ignore', 'pipe', 'pipe'] });
let emuLog = '';
emu.stdout.on('data', d => { emuLog += d; }); emu.stderr.on('data', d => { emuLog += d; });
const toxta = () => { try{ emu.kill('SIGTERM'); }catch(e){} };
process.on('exit', toxta);
await kutGacha(() => /Dev App Server is now running|API endpoint: http/.test(emuLog), 60000, 'emulyator ishga tushishi');

const env = await initializeTestEnvironment({
  projectId: 'kabir-sinov',
  firestore: { host: HOST, port: PORT, rules: fs.readFileSync(path.join(ROOT, 'firestore.rules'), 'utf8') },
});
const ST = () => firebase.firestore.FieldValue.serverTimestamp();
const yozuvlar = (db, kol = 'kabir') => db.collection(kol).doc('_daftar').collection('yozuvlar');
const bosh = (db, kol = 'kabir') => db.collection(kol).doc('_daftar').collection('navbat').doc('bosh');
const qator = (x = {}) => Object.assign({ o: '[]', ol: 1, t: ST(), q: 'sinov', v: 'd1', iz: '', ts: Date.now() }, x);
function talon(db, ids, kol = 'kabir', nBer){   // daftar.js talonYoz kabi: navbat +1 va qator(lar) bitta tranzaksiyada
  return db.runTransaction(async tx => {
    const s = await tx.get(bosh(db, kol)), n = nBer !== undefined ? nBer : (s.exists ? s.data().n : 0) + 1, t = ST();
    tx.set(bosh(db, kol), { n, y: ids[0], t });
    ids.forEach((id, j) => tx.set(yozuvlar(db, kol).doc(id), Object.assign(j ? {} : { ch: n }, qator({ t }))));
  });
}

const sinovlar = [];
const sinov = (nom, fn) => sinovlar.push({ nom, fn });

sinov('eski jadvallar hozirgidek ochiq: o\'qish, yozish, yangilash, o\'chirish', async () => {
  const db = env.unauthenticatedContext().firestore();
  for(const kol of ['products', 'units', 'stores', 'sales', 'orders', 'customers', 'activity', 'users', 'rasmlar']){
    await assertSucceeds(db.collection(kol).doc('x1').set({ a: 1 }));
    await assertSucceeds(db.collection(kol).doc('x1').set({ b: 2 }, { merge: true }));
    await assertSucceeds(db.collection(kol).doc('x1').update({ a: 3 }));
    await assertSucceeds(db.collection(kol).get());
    await assertSucceeds(db.collection(kol).doc('x1').delete());
  }
});

sinov('daftar qatori: qo\'shish va o\'qish mumkin', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(yozuvlar(db).doc('q1').set(qator()));
  await assertSucceeds(yozuvlar(db).doc('q1').get());
  await assertSucceeds(yozuvlar(db).orderBy('t').get());
  await assertSucceeds(yozuvlar(db, 'TEST_kabir').doc('q1').set(qator()));
});

sinov('daftar qatorini o\'zgartirib ham, o\'chirib ham bo\'lmaydi', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(yozuvlar(db).doc('q2').set(qator()));
  await assertFails(yozuvlar(db).doc('q2').set(qator({ o: '["boshqa"]' })));          // ustidan yozish
  await assertFails(yozuvlar(db).doc('q2').set({ o: 'x' }, { merge: true }));
  await assertFails(yozuvlar(db).doc('q2').update({ o: 'x' }));
  await assertFails(yozuvlar(db).doc('q2').delete());
});

sinov('belgisiz, soxta vaqtli yoki noto\'g\'ri qator rad etiladi', async () => {
  const db = env.unauthenticatedContext().firestore();
  const q = qator(); delete q.ol;
  await assertFails(yozuvlar(db).doc('r1').set(q));
  await assertFails(yozuvlar(db).doc('r2').set(qator({ ol: 2 })));
  await assertFails(yozuvlar(db).doc('r3').set(qator({ t: firebase.firestore.Timestamp.fromMillis(Date.now() + 3600e3) })));
  await assertFails(yozuvlar(db).doc('r4').set(qator({ o: 123 })));
});

sinov('daftar papkasining boshqa joylariga yozib bo\'lmaydi', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(db.collection('kabir').doc('_daftar').set({ a: 1 }));
  await assertFails(db.collection('kabir').doc('boshqa').set({ a: 1 }));
  await assertFails(db.collection('kabir').doc('_daftar').collection('boshqa').doc('x').set({ a: 1 }));
  await assertFails(bosh(db).delete());
});

sinov('ombor qulfi: navbat faqat +1 va o\'z qatori bilan birga', async () => {
  const db = env.unauthenticatedContext().firestore();
  await env.clearFirestore();
  await assertSucceeds(talon(db, ['c1']));                                    // n=1
  await assertSucceeds(talon(db, ['c2']));                                    // n=2
  assert.equal((await bosh(db).get()).data().n, 2);
  await assertFails(talon(db, ['c3'], 'kabir', 5));                           // sakrash
  await assertFails(talon(db, ['c4'], 'kabir', 2));                           // takror raqam
  await assertFails(yozuvlar(db).doc('c5').set(qator({ ch: 2 })));           // raqam bor, navbat yangilanmagan
  await assertFails(yozuvlar(db).doc('c6').set(qator({ ch: 3 })));
  await assertFails(bosh(db).set({ n: 3, y: 'yoq-qator', t: ST() }));        // navbat qatorsiz
  await assertFails(bosh(db).set({ n: 2, y: 'c2', t: ST() }));                // o'zgarmagan raqam
  await assertSucceeds(talon(db, ['c7~0', 'c7~1', 'c7~2']));                  // bo'laklangan katta qulfli yozuv
  assert.equal((await bosh(db).get()).data().n, 3);
  await assertSucceeds(talon(db, ['t1'], 'TEST_kabir'));                      // sinov daftari alohida sanaladi
  assert.equal((await bosh(db, 'TEST_kabir').get()).data().n, 1);
});

// ── daftar.js haqiqiy Firestore (emulyator) bilan ──
function telefon(nom, db){
  const xotira = { xom: null, meta: null }, holatlar = [];
  const d = DF.Daftar({
    db: () => db, kol: () => 'TEST_kabir', qurilma: () => nom, ver: 'sinov',
    serverVaqt: ST, vaqtDan: ms => firebase.firestore.Timestamp.fromMillis(ms),
    xomOl: () => xotira.xom, lokalSaqla: j => { xotira.xom = j; },
    metaOl: () => xotira.meta ? JSON.parse(JSON.stringify(xotira.meta)) : null, metaYoz: m => { xotira.meta = m; },
    holat: (r, t) => holatlar.push(r + ' ' + t), xatoLog: e => { if(process.env.IZ) console.error(nom, e); },
  });
  return { d, db, nom, holat: () => holatlar[holatlar.length - 1] };
}
async function birXil(...tl){
  await kutGacha(() => tl.every(t => t.d.tayyor()) && tl.every(t => kanon(t.d.holat()) === kanon(tl[0].d.holat())), 10000, 'telefonlar bir xil');
}
const sotish = (uid, sid) => baza => {
  const u = baza.units[uid];
  if(!u || u.status !== 'available') return { rad: 'sotilgan' };
  return [{ t: 'upsert', j: 'units', r: { id: uid, status: 'sold' } },
          { t: 'insert', j: 'sales', r: { id: sid, unit_ids: [u.unit_id], store_id: u.location, product_id: u.product_id, qty: 1, total_amount: 520, paid: true, partial_payments: [] } }];
};

sinov('daftar.js + haqiqiy Firestore: ko\'chirish, ikki telefon, qulf, internetsiz navbat', async () => {
  await env.clearFirestore();
  const A = telefon('A', env.unauthenticatedContext().firestore()), B = telefon('B', env.unauthenticatedContext().firestore());
  assert.notEqual(A.db, B.db, 'ikki alohida telefon');
  A.d.ulan(); B.d.ulan();
  await kutGacha(() => A.d.tayyor() && B.d.tayyor(), 10000, 'ulanish');
  await A.d.kochir({
    products: [{ id: 'p1', name: 'Divan Milano', sku: 'DV014', price: 520, cost_items: [], image: 'data:,' }],
    units: [1, 2, 3].map(i => ({ id: 'u' + i, unit_id: 'DV014-#000' + i, product_id: 'p1', location: 's1', status: 'available' })),
    stores: [{ id: 's1', name: 'Do\'kon A', phone: '' }],
    sales: [{ id: 'sa1', total_amount: 520, paid: false, partial_payments: [{ id: 'pp1', amount: 100, method: 'cash', date: '2026-10-01' }] }],
    orders: [{ id: 'o1', order_id: 'ZK-0001', status: 'pending', status_history: [{ status: 'pending', time: '2026-10-01T00:00:00.000Z' }] }],
  }, 'ko\'chirish');
  await birXil(A, B);
  assert.equal(B.d.holat().units.u2.unit_id, 'DV014-#0002');

  // bitta donani ikkalasi bir vaqtda sotadi — faqat bittasi o'tadi
  const r = await Promise.allSettled([A.d.amal('Sotildi', sotish('u1', 'sA'), { qulf: true }), B.d.amal('Sotildi', sotish('u1', 'sB'), { qulf: true })]);
  assert.deepEqual(r.map(x => x.status).sort(), ['fulfilled', 'rejected'], JSON.stringify(r.map(x => x.reason && x.reason.sabab)));
  assert.equal(r.find(x => x.status === 'rejected').reason.sabab, 'sotilgan');

  // turli maydonlar bir vaqtda — ikkalasi ham qoladi
  await Promise.all([
    A.d.amal('t', () => [{ t: 'update', j: 'stores', id: 's1', f: { name: 'Do\'kon A2' } }]),
    B.d.amal('t', () => [{ t: 'update', j: 'stores', id: 's1', f: { phone: '+998900000000' } }]),
  ]);
  await birXil(A, B);
  assert.equal(A.d.holat().stores.s1.name, 'Do\'kon A2');
  assert.equal(A.d.holat().stores.s1.phone, '+998900000000');

  // internet yo'q: to'lov navbatga turadi, sotuv saqlanmaydi; ulanganda navbat ketadi
  await A.db.disableNetwork();
  await kutGacha(() => !A.d._ichki().serverdan, 5000, 'offlayn sezildi');
  await A.d.amal('To\'lov', b => [{ t: 'upsert', j: 'sales', r: { id: 'sa1', partial_payments: [...b.sales.sa1.partial_payments, { id: 'pp2', amount: 420, method: 'card', date: '2026-10-13' }], paid: true } }]);
  await assert.rejects(A.d.amal('Sotildi', sotish('u2', 'sC'), { qulf: true }), e => e.sabab === 'internet');
  assert.equal(A.d.navbatda(), 1);
  await A.db.enableNetwork();
  await birXil(A, B);
  assert.equal(B.d.holat().sales.sa1.paid, true);
  assert.deepEqual(B.d.holat().sales.sa1.partial_payments.map(p => p.id), ['pp1', 'pp2']);
  assert.equal(B.d.holat().units.u2.status, 'available');

  for(const t of [A, B]){ const k = await t.d.tekshir(); assert.equal(k.ok, true, t.nom + ' tekshir: ' + JSON.stringify(k.farq)); }
  A.d.uzil(); B.d.uzil();
});

let xatolar = 0;
for(const s of sinovlar){
  try{ await s.fn(); console.log('✓ ' + s.nom); }
  catch(e){ xatolar++; console.log('✗ ' + s.nom + '\n    ' + String(e && e.stack || e).split('\n').slice(0, 5).join('\n    ')); }
}
console.log(`\n${sinovlar.length - xatolar}/${sinovlar.length} o'tdi`);
await env.cleanup();
toxta();
process.exit(xatolar ? 1 : 0);
