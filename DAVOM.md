# DAVOM.md — qayerdan davom etamiz

> Har seans boshida o'qiladi. Ish qoidalari — `CLAUDE.md`.
> Har o'zgarishdan keyin DARHOL yangilanadi.

**Oxirgi yangilanish:** 2026-10-13 · **main = v1.24 commiti — PUSH QILINDI (prod)** (v1.24 — «Sonlarni 0 qilish»). Ibrohim tekshiradi: v1.23 surish/scroll (iPhone), v1.24 sozlamalar → «Sonlarni 0 qilish» (superadmin). Navbatda: hisobot tahriri (5–10) · v1.20 soya: superadmin ochadi → birinchi nusxa · DAFTAR'dan o'qishga o'tish (7/7 dan keyin)

## ✅ v1.24 — SONLARNI 0 QILISH (2026-10-13) — PUSH QILINDI (prod)

Ibrohim: «0 qilishni maketdagidek qil» → taxmin bloki → «haa». Qarorlar 1–6 tavsiya bo'yicha.
Qilingan:  sozlamalar menyusi — `user?.role === "superadmin"` da «Sonlarni 0 qilish» (qizil, trash belgisi);
           `NolModal` (ReturnModal dan oldin) — `{modal === "nol" && <Screen key="nol" render={NolModal} />}` (Screen —
           App qayta chizilsa belgilar saqlanadi): Ombor (har doim) + donasi bor do'konlar, sonlari, model / vitrina summasi,
           boshida hammasi belgilangan; «0 bo'ladi N dona»; «O'zgarmaydi»; «Raqam davom etadi» misoli (generateUnitId);
           «0 qilish» → askConfirm (joylar, dona, vitrina qarzi kamayishi) → `nol`: units server'dan qayta o'qiladi, faqat
           hali "available" va joyi o'zgarmaganlari → `db.from("units").update({status:"nol"}).in(id, 400 tadan)` →
           setUnits → `log("Sonlar 0 qilindi", "Ombor N dona, …")` → natija oynada («N dona tegilmadi» ham).
           Ombor donalar ro'yxati (~2528): «0 qilingan» kulrang (t.dim).
           Taxmindan farq: verifyUnitsUnchanged o'rniga to'g'ridan tekshiruv — u «baribir davom etilsinmi?» deb so'raydi va
           boshqa telefon sotgan donani ham "nol" qilib yuborishi mumkin edi; endi bunday dona tegilmaydi.
Sinov:     JSX OK; emulyator + firestore.rules, brauzer 5/5: admin'da menyu yo'q; superadmin oyna (452+3 dona, vitrina $1,060);
           belgi olib/qo'yish; tasdiq matni; boshqa telefon sotgan dona tegilmadi (sold qoldi); 451 dona = 2 bo'lak (400+51);
           dona o'chmagan (unit_id joyida); activity bitta; daftarga ham tushgan (soya); Bosh «Vitrina qarzi $0»; ro'yxatda
           «0 qilingan». Xato/alert yo'q.

## ✅ v1.23 — TELEFONDA SURISH VA SCROLL (2026-10-13) — PUSH QILINDI (prod), Ibrohim tekshiradi

Ibrohim (2 skrinshot, iPhone ilova rejimi): «swipe qilsam scroll pastga tushib, ekran o'ynab ketyapti; scroll tepaga
           taqalsa tepaning ochilishi nega kerak» → taxmin bloki → «scroll + swipe qilsam shunaqa bo'lyapti, push qil tekshiraman».
Tashxis:   ro'yxat `#main-scroll` ichida; tepaga yetganda iOS harakatni butun hujjatga uzatadi → sarlavha bilan butun ekran
           cho'ziladi. React touchmove passiv — `swMove` tik scroll'ni to'xtata olmaydi (qiyshiq barmoq = ikkala yo'nalish).
Qilingan:  CSS @media(max-width:480px) (~110–112): `html:has(#main-scroll), … body {overflow:hidden; overscroll-behavior:none}`,
           `#main-scroll {overscroll-behavior-y:contain; touch-action:pan-y}`; `goTab` (~3369) + `scrollTo(0,0)` — surish va
           menyu bilan o'tilgan sahifa tepadan ochiladi. Login/QR sahifa, PC/planshet — tegilmadi.
Sinov:     JSX OK; Chromium telefon rejimi (CDP barmoq hodisalari) 6/6: CSS qo'llangan, tik scroll ishlaydi, qiyshiq surish
           bo'lim almashtiradi va scroll qimirlamaydi, `.tg-tabs` barmoq bilan suriladi, PC o'zgarmagan.
           ⚠ Chromium iOS cho'zilishini takrorlamaydi (v1.22 da ham surish sinovlari o'tdi) — natija faqat iPhone'da ko'rinadi.
Javobsiz:  Ibrohim iPhone'da tekshiradi — «o'zgarmadi» desa: avval prodda v1.23 ekanini so'ra (ilovani yopib ochish).

## 📌 QOIDA — DIZAYN USLUBI iOS + TELEGRAM (2026-10-13)

Ibrohim: «bo'ldi, o'zingga qoida qilib qo'y: menga iOS Telegram'dagidek uslub yoqadi — swipe qilganda, scroll qilganda,
ro'yxatdagi xiralashishlar». → CLAUDE.md §1 «DIZAYN USLUBI» (jadval: tab/segment, suriladigan qator, swipe, scroll
xiralashishi, ochiladigan bo'lim, oyna — har biri koddagi namunasi bilan). Har yangi ekran va maket shu uslubda.

## ✅ v1.22 — HISOBOT TUGMALARI iOS/TELEGRAM KABI DUMALOQ (2026-10-13) — PUSH QILINDI (prod)

Ibrohim (skrinshot, ikkala qator belgilangan): «shularniyam qilsa bo'ladimi, iOS Telegram'dagidek» → vizual, «ha».
Qilingan:  `StoreProfile` → `hisobot()`: «Hammasi | Bu oy» — dumaloq (999) + suriladigan oq belgi (tur filtridagi prujina);
           tur filtri (Hammasi | Jo'natish | Sotuv | Qaytish | Pul) — chiziq va oq belgi 9/7 → 999. Mantiq tegilmadi.
Sinov:     JSX OK; brauzer 3/3 (moder, superadmin, 320px).

## ✅ v1.21 — DO'KON HISOBOTI (ko'rish qismi) (2026-10-13) — PUSH QILINDI (prod)

Ibrohim: «Hisobot bilan push qil main'ga» → savol: «Hisobotni yoz, birga push» → taxmin bloki → «push qil didimku…;
           taxmin 1 — shunaqa qil, faqat Telegram'dagidek surilsin, iOS'dagidek dumaloq; 2) moder ko'rsin, lekin tahrirlamasin».
Qilingan:  `StoreProfile` (index.html ~2672): hooklar hDavr/hTur/hOchiq (`if (!store)` dan yuqorida; komponent `Screen` ichida);
           `hisobot()` (~2705) — A manba, faqat o'qiydi: Jo'natildi = do'kondagi donalar `sentAt` (sana+model, unit ID'lar,
           sotilganlari ham); Sotildi = `sales`; Qaytdi = `activity` «Vitrinadan qaytarildi», matn oxiri «— do'kon nomi»,
           dona matndan; Pul olindi = `allPayments` («qisman» — sotuv yopilmagan). Tepada 4 son (davrdagi dona + hozir
           vitrinada), pul: Sotuv / Olingan pul / Qarz qoldi; davr «Hammasi | Bu oy» (today() oyi); tur: Hammasi | Jo'natish |
           Sotuv | Qaytish | Pul (oq belgi suriladi); amallar sana bo'yicha, boshida yopiq. Amal bosilmaydi (tahrir yo'q).
           Bo'lim tugmalari (~2840): 5-chi «Hisobot»; `.tg-tabs` (CSS ~47) — yonga suriladi, scrollbar yo'q, dumaloq
           (borderRadius 999), bosilgan tugma ko'rinishga suriladi. Moder ham ko'radi (hisobotda tannarx/foyda yo'q).
Sinov:     JSX OK; brauzer (emulyator, soxta seed) 3/3: moder va superadmin — sonlar/pul to'g'ri (Hammasi va Bu oy), kun
           ochiladi, «Pul» filtri, xato/alert yo'q; 320px da tugmalar suriladi. 320px da sahifa kengligi 360 — v1.20 da ham
           363 (eski, sarlavha belgilari) — tegilmadi.
Qolgan:    tahrirlash (qarorlar 5–10) — alohida; Ibrohim: moder hisobotni KO'RADI, lekin TAHRIRLAMAYDI (tahrir qilinganda
           shu qoida). DAFTAR'ga o'tilgach C rejimi (to'liq jo'natish/qaytish + «jo'natildi−sotildi−qaytdi=vitrinada»).

## (eski) DO'KON HISOBOTI — MAKET (2026-10-13)

TARTIB (Ibrohim, 2026-10-13): «Bo'ldi, daftarga o'tqiz, keyin hisobotni to'g'rilaymiz» → AVVAL DAFTAR (pastdagi bo'lim),
           do'kon hisoboti va tahrirlash — DAFTAR'dan keyin. Qarorlar 1–10 hali javobsiz.

Ibrohim: «Vitrina, Sotuv, To'lov joyiga Hisobot qo'sh — shu do'kon hisoboti: qachon nima borgani, vozvrat, olingan pul hammasi».
Maket:     https://claude.ai/artifact/KSPHJnCkhkkYvkTaiwksso (hozirgi vs taklif, A/C tugmasi, tashxis, 4 qaror). KOD YOZILMAGAN.
Tashxis:   Sotildi va Pul olindi — to'liq (`sales`, `partial_payments`/`paid`). Jo'natildi — `units.sent_at` (qaytarilganda
           `ReturnModal` sent_at=null qiladi → qaytgan molning jo'natilgani yo'qoladi). Qaytdi — faqat `activity` matni
           «Vitrinadan qaytarildi: <mahsulot> N dona — <do'kon nomi>» (do'kon id/unit ID yo'q). Naqsh: `PcOmborPane` «Harakatlar».
Qarorlar (tavsiya): 1) manba A (faqat o'qiydi) hozir, DAFTAR kelgach C (to'liq + «jo'natildi−sotildi−qaytdi=vitrinada»);
           2) davr «Hammasi | Bu oy»; 3) zakazlar kirmaydi; 4) 5-bo'lim «Hisobot» oxirida. Diff taxmini ~70–90 qator, versiya v1.20 dan keyingisi (v1.20 — soya rejimi).
Maket tuzatishlari (Ibrohim, bittadan): v2 — tur tugmalari bitta qatorga sig'adi, iOS kabi oq belgi suriladi;
           v3 — amallar sanalar bo'yicha yig'ilgan (Tilla kabi «12/10/2026 · 2 ta», bosilsa ochiladi, boshida yopiq).
           v4 — amalni bosib tahrirlash oynasi (sotuv: model/dona/narx; jo'natish: model/dona; qaytish: dona (faqat C);
           pul: summa/usul/sana), «Nima o'zgaradi» — qaysi ID qayerga ko'chishi, qarz, xatolar; tahrir tashxisi + qarorlar 5–10.
Tahrir tashxisi: sotuv dona/model = `sales` + `units` (tranzaksiya emas, garantiya qayta chop); pul = `partial_payments`
           butun massiv (to'liq to'lov summasi saqlanmaydi, :2481); qaytish yozuvi yo'q; do'konga to'g'ridan kirim kamaytirilsa
           ID takrorlanadi (:1220). Tavsiya: hozir faqat narx/summa va pul, dona/model — DAFTAR (ombor qulfi) bilan.
Keyingi qadam: Ibrohim 1–10 tanlovi → TAXMIN BLOKI → kod (avval hisobot o'qish qismi, tahrir alohida versiya).

## ⏳ KEYINGI ISH — DAFTAR TIZIMIGA O'TISH (2026-10-13) — 1–2-BOSQICH TAYYOR, 3-BOSQICH KEYINGI

Ibrohim: «Tilla ERP dagi DAFTAR tizimini Kabir ERP ga ko'chirmoqchiman» → maket+reja → «bo'ldi unda shu sistemaga
o'tqizaylik» → qarorlar (AskUserQuestion, 2026-10-13): **hammasi tavsiya bo'yicha**, `daftar.js` alohida fayl — HA,
yangi seansda boshlash. CLAUDE.md §0.5 ga «DAFTAR istisnosi» yozildi.
Maket+reja: https://claude.ai/artifact/U1Hs86Tv5HQf9iXkPPQA5u (oqim, kalitlar, ombor qulfi, internet-yo'q UX, qoida qoralamasi,
           7 bosqich). KOD YOZILMAGAN.
QARORLAR:  1B har AMAL = daftarda BITTA qator (sotuv/jo'natish/qaytarish/omborga qo'shish/zakaz/o'chirishlar guruhlanadi) ·
           2A internet yo'q paytda navbatli amal (sotuv, jo'natish, …) SAQLANMAYDI — oyna ochilishida sariq ogohlantirish,
           tugma «Internet kutilmoqda…», kiritilganlar yo'qolmaydi · 3B rasmlar daftarga KIRMAYDI, alohida omborda (havola) —
           ombor tanlovi keyin (Firebase Storage endi Blaze talab qilishi mumkin → Vercel Blob tekshiriladi) · 4A Firebase
           Auth hozircha YO'Q (qoida faqat «o'zgartirib/o'chirib bo'lmaydi»ni kafolatlaydi) · 5A TEST rejimi manzil oxiridagi
           `#sinov` bilan, `TEST_kabir` daftari · 6A QR uchun alohida ochiq katalog (tannarxsiz) · 7 CLAUDE.md istisnosi — yozildi.
Tarif:     Ibrohim bilmaydi («bepuli yetsa kerak?»). Taxmin: DAFTAR bilan Spark bemalol yetadi (har telefon faqat yangi
           qatorlarni o'qiydi; kuniga yuzlab o'qish/yozish). Konsolda chap pastda «Spark/Blaze» yozuvi — tekshirish so'raladi.
MANBA:     tilla-erp origin/main @ 638277f — `daftar.js` (656 q.: yassi/farq/qolla/indeks, Daftar: boshla/saqla/kochir/tekshir/
           quril/yubor/ulan/qabul, v188.85: navbat/talonYoz/chiqimBoshla/cjUrin/cjKut/cjNomalum/cjTugat/qaytar/yetkaz);
           index.html: `DAFTAR_REJIM` (2085), save() shoxi (2537), IndexedDB 'tilla-daftar' (_dfIdb, _dfOmborYoz — d+m bitta
           tranzaksiyada), `DF.Daftar({...})` env (20824), _dfKutish/_dfRad; DAVOM v188.85 qoida (create ol==1, ch→getAfter navbat).
SABOQLAR:  forEach(yubor) (daftar.js:558,:561 — indeks `vaada` bo'ladi) → `forEach(e => yubor(e))` + sinov (navbatda 3 ta,
           2-chisi rad → xato ko'rinsin); «Qayta bosmang» butun ekran (:495) → faqat tugma holati + orqada tekshiruv + qisqa xabar.
KABIR KALITLARI: `<jadval>:<id>` bor, `<jadval>:<id>.<maydon>` (faqat `MAYDON` ro'yxati, snake_case); `sales:<id>.partial_payments`
           + `sales:<id>.pp:<ppid>` (har qisman to'lov alohida); `orders:<id>.status_history` + `orders:<id>.sh:<vaqt>~<n>`;
           `activity` ham maydonlab (action/details/time); users va `products.image` — daftarga kirmaydi.
           _oid kerak emas (id bor). Navbat raqami bilan: sotuv, jo'natish, qaytarish, mahsulot/do'kon o'chirish, omborga qo'shish
           (unit ID sanog'i), yangi zakaz (ZK- sanog'i). Qulfsiz: to'lov, tahrirlar, mijoz, zakaz statusi, tarix.
KABIR ULANISH JOYLARI: `db` o'rami (index.html ~191), `loadAll` (~497), yozuvlar 19 joy (grep 'db.from("[a-z]*")\.(insert|
           upsert|update|delete)'), verifyUnitsUnchanged (~572), generateUnitId (~591, :1053/:1229), ZK- (~1770), PayModal
           partial_payments (~1689), importBackup (~415), QR (~448). Firestore `enablePersistence` (~151).
BOSQICHLAR: 1) `daftar.js` (yangi fayl, index.html ga ULANMAYDI) + Node birlik sinovlari (scratchpad) → 2) Firebase qoidasi
           emulyatorda (java bor; firebase-tools npm) → Ibrohim Publish (joriy qoida RASMI kerak) → 3) `#sinov` TEST rejimi + db
           o'rami/loadAll → 4) guruhlash + ombor qulfi + internet-yo'q UX → 5) TEST'ga ko'chirish (prod faqat O'QILADI) + tekshir
           1:1 → 6) Ibrohim 2 telefonda sinaydi → 7) o'tish kuni. Har bosqich alohida versiya, UI bo'lsa avval maket.
✅ 1-BOSQICH (2026-10-13, Ibrohim: «daftarni tugat» → taxmin bloki → «muammo ko'rmayapman» = ha):
           Qarorlar: sinovlar repoda `sinov/` (.vercelignore'da yashirin); daftar joyi `kabir/_daftar/…` (sinov: `TEST_kabir`);
           qulfli amal QAYTA QURILADI; rasmlar keyin alohida `rasmlar` kolleksiyasiga (Firebase ichida).
Fayllar:   `daftar.js` (630 q., index.html YUKLAMAYDI) — `DF.Daftar(env)`: boshla/amal(izoh, qur, {qulf})/ulan/uzil/
           qaytaYubor/tekshir/kochir(royxatlar)/quril/holat/tayyor/navbatda/tashlandi. Yordamchilar: yassi/farq/qolla/
           opsHisobla/bazaDan/Holat. qur(baza) → [{t:'insert'|'upsert', j, r}, {t:'update', j, id, f}, {t:'delete', j, id}]
           yoki {rad:'sabab'}; xulq hozirgi `db` o'rami bilan bir xil (insert almashtiradi, upsert/update qo'shadi, massiv butun).
           `sinov/soxta-firestore.mjs` (server + telefonlar, qoida taqlidi: faqat yaratish, ol==1, navbat +1),
           `sinov/daftar.test.mjs` — 25 sinov (19 holat + 6 tasodifiy 3-telefon). Ishga tushirish: `node sinov/daftar.test.mjs`;
           ko'proq: `URUGLAR=60 node sinov/daftar.test.mjs` (79/79 o'tgan).
TOPILGAN XATO (Tilla'da ham bor!): o'z yozuvlarim cloudda boshqa tartibda tushsa (biri rad etilib qayta yuborilsa) telefon
           cloud'dan farqli qiymatda qolardi. Kabir'da tuzatildi (`qabul` — o'z yozuvi tasdiqlanganda eng keyingi qiymat
           qayta qo'yiladi). Tilla'ga TEGILMADI — Ibrohimga aytildi, Tilla seansida alohida tuzatiladi.
✅ 2-BOSQICH (2026-10-13) — IBROHIM PUBLISH QILDI («Publish qildim»), qoida PRODDA
Hozirgi prod qoida (Ibrohim rasmi): `match /{document=**} { allow read, write: if true; }` — hammasi ochiq.
Qilingan:  `firestore.rules` — eski jadvallar AYNAN avvalgidek ochiq (`/{kol}/{qolgan=**}`, kol kabir/TEST_kabir dan
           boshqa); `<kol>/_daftar/yozuvlar/{id}`: read; create faqat ol==1, t==request.time, o string, ch bo'lsa
           getAfter(navbat).n==ch va .y==id; update/delete YO'Q. `<kol>/_daftar/navbat/bosh`: create/update faqat n==eski+1,
           t==request.time, getAfter(yozuvlar/y).ch==n; delete YO'Q. Konsol (admin) qoidadan tashqarida.
Sinov:     `sinov/qoida.test.mjs` — Firestore emulyatori v1.19.7 + firebase 10.14.1 + rules-unit-testing 3.0.4 (/tmp/kabir-fb,
           repoga kirmaydi): 7/7 — eski jadvallar ochiq, daftar faqat qo'shish, soxta vaqt/ol'siz rad, navbat sakrash/takror rad,
           bo'laklangan qulfli yozuv o'tadi, daftar.js 2 telefon (ko'chirish, qulf, offlayn navbat, tekshir 1:1) haqiqiy SDK bilan.
Ko'rsatma: https://claude.ai/artifact/AdoG7EHDTm3kDv5uhvXd7j (nusxa tugmasi, 4 qadam, orqaga qaytarish — eski qoida matni).
Tekshiruv: Ibrohimdan — ilova (Ombor/Do'kon) Publish'dan keyin odatdagidek ochilishini tasdiqlash so'raldi.
Ibrohim: Publish'dan keyin ilova (Ombor/Do'kon) «ochildi» — tasdiqlandi. main = c539c0b (push qilingan).
⏳ 3-BOSQICH — MAKET, JAVOB KUTILMOQDA (2026-10-13): https://claude.ai/artifact/MoeY7DdsGBguX1TWFXWHst
           #sinov: tepada to'q sariq tasma, bulut tugmasi = daftar holati (yashil 1:1 / sariq yuborilmoqda / internet yo'q /
           qizil yozilmadi), bosilsa oyna (navbat, oxirgi yozuv, qatorlar, TEST_kabir, Tekshirish, Sinovdan chiqish);
           sinov bazasi boshida bo'sh. Kodda: db o'rami (~200–260) sinovda daftarga; loadAll (~497–515) daftar holatidan,
           boshqa telefon o'zgarishi jonli; bulut (~3184); login/users o'zgarmaydi; rasm → TEST_rasmlar; nusxa IndexedDB.
           3-bosqichda har yozuv alohida qator (guruhlash, qulf, internet-yo'q UX — 4-bosqich), oddiy manzil o'zgarmaydi.
           Qarorlar (tavsiya): 1) faqat manzil #sinov; 2) bo'sh baza; 3) TEST_rasmlar; 4) faqat tasma (versiya yonida
           SINOV — uzun sarlavhada sig'maydi). Taxminiy versiya v1.20.
❌ #sinov rejimi BEKOR (Ibrohim: «menga sinov kerak emas» → «main'da amalda qilsa bo'lmaydimi» → «A ni qil»).
✅ 3-BOSQICH O'RNIGA — SOYA REJIMI: maket (2026-10-13) https://claude.ai/artifact/KFawfZMHuzipdHZuJPyCdv — Ibrohim «shunaqa qil» (1–4 tavsiya bo'yicha) → «ha boshla» → v1.20 KODDA (pastda)
           Ilova eski jadvallardan ishlaydi (asosiy nusxa o'zgarmaydi); db o'rami yozuvdan keyin xuddi o'sha yozuvni daftarga
           ham yuboradi (kutmasdan, xatosi ilovaga chiqmaydi, id bir xil); superadmin ochganda daftar bo'sh bo'lsa — 7 jadval
           YANGIDAN o'qilib bitta katta yozuv (kochir, navbat qulfi bilan); kuniga bir marta solishtirish (eski jadvallar
           yangidan o'qilib, daftar holati bilan kalitma-kalit; farq ro'yxati oynada); superadminda bulut yonida rangli nuqta +
           oyna (holat, farqlar, «O'tishga tayyorlik N/7 kun», «Hozir solishtirish»). Boshqa rollarda o'zgarish yo'q.
           Qarorlar (tavsiya): 1) birinchi nusxa avtomatik; 2) faqat superadmin; 3) ketma-ket 7 kun 1:1; 4) farq — faqat
           ko'rsatadi, Ibrohim rasmini yuboradi. Kod: TEST_kabir emas, `kabir` daftari (prod daftar, eski jadvallarga tegmaydi).
           Ehtimoliy farq manbai: eski tizimdagi ikki telefon to'qnashuvi (masalan, to'lov massivi ustidan yozilishi) — daftar
           ikkala to'lovni saqlaydi. O'tish (eski → daftardan o'qish) — alohida versiya, alohida «ha».
✅ v1.20 — SOYA REJIMI (2026-10-13) — PUSH QILINDI (prod, v1.21 bilan birga)
Branch:    claude/pc-versiya → main
Qilingan:  index.html:24 `<script src="daftar.js?v=1.20">` (firebase compat'dan keyin);
           db o'rami (`db._run`, ~207–268): batch.commit() muvaffaqiyatidan KEYIN `soyaYoz(...)` — insert/upsert (id bilan
           tozalangan hujjatlar), update/delete (fsGetAll topgan id'lar). Faqat DF.MAYDON jadvallari (users — yo'q).
           Soya moduli (`SOYA`, `soyaYoz`, `soyaBoshla`, `soyaNazorat`, `soyaKorinish` …, ~275–417, HELPERS dan oldin):
           dvigatel `kabir` daftari; holat nusxasi IndexedDB `kabir_daftar` (k/xom), meta — localStorage `kabir_daftar_meta`,
           qurilma id — `kabir_qurilma`. Dvigatel FAQAT kirgan foydalanuvchida (`App` hook ~597 `if (user) soyaBoshla()`) —
           QR ochiq sahifasida ishlamaydi. Superadmin: daftar navbati (`kabir/_daftar/navbat/bosh`) yo'q bo'lsa — 7 jadval
           server'dan o'qilib `kochir` (birinchi nusxa); kuniga 1 marta solishtirish (eski jadvallar server'dan ↔ daftar
           holati, yassi kalitlar; farq bo'lsa 10 s kutib QAYTA — ikkalasida bor kalit farq hisoblanadi); 1-kuni (boshlangan
           = bugun) farq chiqsa — bitta marta qayta kochir. Natija Firestore `kabir_soya/holat`: boshlangan, seriya (1:1
           kunlar ketma-ket; farq → 0; bir kunda bir marta oshadi), seriyaKun, oxirgi {vaqt, ok, farqSoni, farq[20], amallar}.
           `SoyaTugma` (~511, App'dan TASHQARIDA — o'z holati, App'ni qayta chizdirmaydi; oyna portal bilan body'ga):
           superadmin bulut belgisi ustida shaffof tugma + rangli nuqta, bosilsa oyna (maketdagidek).
           Header (~3393): bulut div o'ralgan `position:relative`; `{user?.role === "superadmin" && <SoyaTugma t={t} />}`.
           daftar.js: `meta.jami` (daftardagi amallar soni) + `jami()`; sinov/daftar.test.mjs ga jami tekshiruvi.
Sinov:     JSX OK; daftar 25/25 (URUGLAR=30: 49/49); qoida 7/7; brauzer (haqiqiy index.html + firebase compat SDK →
           emulyator, firestore.rules yuklangan) 8/8: superadmin birinchi nusxa + 1:1, admin yozuvlari daftarga (id bir xil,
           rasm/camelCase/users kirmaydi), 1-kun qayta nusxa, farq ko'rsatiladi (tuzatilmaydi, seriya 0), internetsiz yozuv,
           daftar.js 404 — ilova ishlaydi, pageerror/alert/tashqi so'rov yo'q. Brauzer sinov skripti scratchpad'da (repoda yo'q).
           Sinov eslatmasi: Chromium lokal emulyatorga so'rovni bloklaydi — `--disable-features=LocalNetworkAccessChecks,…`
           va sahifa `http://localhost:8899/` (route bilan) kerak.
Keyingi qadam: Ibrohim «push qil» → main → prod. Keyin Ibrohim (superadmin) ilovani ochadi → birinchi nusxa avtomatik →
           bulut nuqtasi yashil bo'lishi kerak; 7 kun kuzatiladi. Farq chiqsa — Ibrohim oyna rasmini yuboradi.
O'tish (daftardan o'qish) — 7/7 dan keyin ALOHIDA versiya, alohida «ha».
Javobsiz:  tarif (Spark/Blaze) — qoidaga ta'sir qilmaydi, rasmlar ombori uchun kerak.

## ✅ VERCEL KUNLIK CHEGARASI (2026-10-13) — HAL QILINDI

Sabab: 24 soatda 124 yig'ish (tilla-erp 69 — 43 tasi `main-dby0je` branch'idan; analitika 26 — `data` va `claude/*` branch'lari;
kabir-erp 25 — 12 main + 13 branch; kitco 4). Bepul tarif: kuniga 100 ta, jamoa («Ibrohim's projects») bo'yicha UMUMIY.
1) Ibrohim qarori: «push qil» = FAQAT main'ga; .md commitlari keyingi versiya bilan birga (CLAUDE.md §8).
2) Ibrohim: «o'zin sozla» → Claude Vercel API orqali 8 ta loyihaning HAMMASIGA `previewDeploymentsDisabled: true` qo'ydi:
   kabir-erp, tilla-erp, analitika, kitco, zavod-erp, ai-office, kabir-gold-ai, tilla-jonli. Production (main) tegilmagan,
   domenlar joyida. Preview havolalar baribir Vercel login ortida edi (ssoProtection) — hech kim ishlatmagan.
   Qaytarish: Vercel → loyiha → Settings → preview deployments yoqish (yoki API: `previewDeploymentsDisabled: false`).
Natija: v1.19 chegara tiklangach main push bilan chiqdi (5daaf9c, production READY).

## ✅ v1.19 — HAMMA QIDIRUVDA «×» (2026-10-13) — PRODDA

Ibrohim: «poiskning yoniga x qo'y» → maket (https://claude.ai/artifact/UTfNjZBeSRKvRXnm512B2A, 2-versiya) → «hammasiga qo'y pc tablet mobilega».
Qilingan:  `s.clr` uslubi (iBtn dan keyin); 4 qidiruvga `{q && <button aria-label="Qidiruvni tozalash" …>×</button>}`:
           DokonlarPane «Do'kon qidirish», WarehousePage «Shu kategoriyada qidirish...» va «Kategoriya qidirish...»,
           StoresPage «Do'kon qidirish». Bosilsa `setQ("")` + `parentElement.querySelector("input").focus()`.
Sinov:     JSX OK; soxta baza: telefon (3 qidiruv), planshet (2), kompyuter (2), telefon qora — bo'shda × yo'q, yozilganda 22×22,
           bosilganda qiymat "", fokus qidiruvda, xato yo'q. (Birinchi urinishda previousSibling bo'sh matn tuguniga tushib
           xato bergan — tuzatildi, commitga kirmagan.)
Prodda: main 5daaf9c (Ibrohim telefonda tekshiradi).

## ✅ v1.18 — KOMPYUTERDAGI DO'KON QIDIRUVI HAM B (2026-10-13) — PRODDA

Ibrohim: «kompda ham shunaqa qil» → «push qil».
Qilingan:  `DokonlarPane` (index.html:2095) `shown` filtri: name/address/manager/phone + telefon raqamlari — StoresPage bilan bir xil.
           Paneldagi «N ta do'kon», tartib, «Topilmadi» matni o'zgarmagan.
Sinov:     JSX OK; soxta baza PC 1440: sergeli/AKMAL/901112233/33 44/diler c/xyz/bo'sh — to'g'ri; telefon qidiruvi o'zgarmagan.

## ✅ v1.17 — DO'KONLAR SAHIFASIGA QIDIRUV (2026-10-13) — PRODDA

Ibrohim: «do'konga ham qidirish qo'shish kerak» → «mockupda ko'rsat» → «B push qil tekshiraman».
Maket:     https://claude.ai/artifact/UTfNjZBeSRKvRXnm512B2A
Qilingan:  `StoresPage` (index.html:2381): `useState("")` early return'dan OLDIN; filtr name/address/manager/phone
           (kichik harf) + telefon raqamlari bo'yicha (`replace(/\D/g, "")`); «Jami» → «Topildi: X / N ta»;
           qidiruv qatori (PC `DokonlarPane` uslubida, 38px, fontSize 16) faqat do'kon bor bo'lsa; bo'sh natija matni.
Sinov:     JSX OK; soxta baza (superadmin, moder): sergeli/AKMAL/901112233/33 44/qarshi/xyz/bo'sh — to'g'ri;
           profilga kirib qaytganda qidiruv saqlanadi, boshqa bo'limdan qaytganda tozalanadi; do'konsiz — eski bo'sh holat.

## ✅ v1.16 — OYNA OCHIQ PAYTDA FON QIMIRLAMAYDI (2026-10-13) — PRODDA

Ibrohim (TransferModal skrinshoti): «nega orqasi o'ynab ketyapti» → tushuntirildi → «ko'rsat» → «push qil tekshiraman».
Maket:     https://claude.ai/artifact/9XvbzGFJdtPoNtfuWSsArt
Qilingan:  11 ta overlay (9 ta `style={s.overlay}` + confirmDialog + printData) ga `className="ovl"`; statik CSS:
           `html:has(.ovl),html:has(.ovl) body{overflow:hidden;overscroll-behavior:none}`, `.ovl,.ovl>*{overscroll-behavior:contain}`,
           `input[type=date]{-webkit-appearance:none;appearance:none;min-width:0;display:block}`.
           Maketdagi «pardada touch-action:none» kodga QO'SHILMADI (iPhone'da uzun oyna surilishini to'xtatish xavfi);
           ko'rinadigan natija bir xil — qulf parda ustidagi surishni ham to'xtatadi.
Sinov:     JSX OK; soxta baza: eski versiyada oyna ochiq turib aylantirilsa hujjat 80px siljiydi, yangisida 0;
           oyna yopilsa qulf ochiladi; uzun Sotuv oynasi ichi g'ildirak va barmoq bilan suriladi (0→168), hujjat 0;
           tasdiqlash oynasi ham qulflaydi; planshet va PC oyna ochiladi; xato yo'q.
           ⚠ iPhone'ning o'zida sinalmagan (Chromium) — Ibrohim prodda tekshiradi.

## ✅ v1.14 + v1.15 — TEPADA VA PASTDA XIRALASHISH (2026-10-13) — PRODDA

Ibrohim (iPhone Sozlamalari rasmi bilan): «tepaga chiqarganda xiralashib yo'q bo'lib ketyapti, Kabir ERP'ni ham shunaqa qiling»;
keyin «push qil tekshiraman» + «pastdan ham xiralashib chiqsin, tepaga o'xshab».
Maket:     https://claude.ai/artifact/SS11Za8sdqdbgfvphtSgfh (2-versiya: tepa + past)
v1.14:     faqat telefonda (@media max-width:480px): `#main-scroll` height 100vh, margin-top -60px, padding-top 76px,
           mask-image tepada (transparent 22px → #000 72px); `<span className="hdr-fx" />` sarlavhada (blur 8px).
v1.15:     mask pastda (#000 → transparent: 100%-96px-safe → 100%-40px-safe), padding-bottom calc(116px + safe-area),
           `<div className="nav-fx" />` menyu oldida (fixed, blur 8px, tepaga so'nadi, z 99, pointer-events none).
Sinov:     JSX OK; soxta baza: telefon oq/qora (tepada/pastda xiralashadi, joyida turganda va oxirida kontent to'liq),
           sarlavha tugmalari bosiladi, menyu va sahifa surish ishlaydi; planshet/PC o'zgarmagan (mask none); ombor roli.

## ⏳ YARIM QOLDI — MA'LUMOT KO'PAYSA / XOTIRA TELEFONDA (2026-10-13) — ENG OXIRGI ISH

Ibrohim: «buni cloud ushlashi qanaqa qilingan, blob bo'lganmi?» (men buni avval menyu haqida deb noto'g'ri tushundim),
keyin: «ma'lumot ko'paysa nima bo'ladi? mockupda ko'rsat, keyin xotira telefonda bo'lishi kerak, Safari'dan chiqarish kerak».
Branch:    claude/pc-versiya — kod YOZILMAGAN, prodda v1.13.
Maket:     https://claude.ai/artifact/U4v1n2mnAqr5q3AwbWsjug (jonli hisob: slayderlar → o'qish/kun, MB, soniya; grafik 1–36 oy).
Tashxis (grep bilan tasdiqlangan): `loadAll` (index.html:489) 7 kolleksiyani to'liq o'qiydi; activity `limit(10000)` telefonda
           (:499); rasm base64 600px JPEG products ichida (:1085); `verifyUnitsUnchanged` (:564) har sotuv/jo'natish/qaytarishda
           butun `units`; `update`/`delete` (:230/:239) butun kolleksiyani o'qiydi; QR (:440) butun products; enablePersistence
           (:151) bor, lekin sayt fayllari keshlanmagan (service worker/manifest yo'q) → internetsiz ochilmaydi.
           Ma'lumot Firebase Firestore'da, Vercel Blob ishlatilmagan.
Taklif:    1) rasmlar alohida omborga (Vercel Blob / Firebase Storage); 2) id bo'yicha o'qish (yozishda butun kolleksiya emas);
           3) activity serverda oxirgi 300; 4) «xotira telefonda» — delta sync (`updated_at` + o'chirilgan belgisi).
           Safari'dan chiqarish: Bosh ekran ikonka (bor) → manifest + service worker (2 yangi fayl, ruxsat kerak) → App Store (tavsiya emas).
Keyingi qadam: Ibrohim javobini kutish, keyin tanlangan qadam uchun alohida maket → TAXMIN BLOKI → kod.
Javobsiz savol: Firebase tarifi (Spark/Blaze) va Usage'dagi kunlik o'qishlar soni? Qaysi qadamdan (tavsiya 2→3→1→4)?
           Manifest + service worker (yangi fayllar): ha/yo'q?

## ✅ v1.13 — MENYU TELEGRAM KABI O'TADI (2026-10-13) — PRODDA

Ibrohim (Telegram papkalar menyusi rasmi bilan): «o'tishini shunaqa qiling, bu yerda bosiladigan bo'lib qolibdi».
Maket: https://claude.ai/artifact/6p38wQ19a5sHuRyTe3AciV → Ibrohim: «ikkalasini ham push qil».
Qilingan:  1) `navDrag` (chap va pastki menyu): doira 4px'dan keyin barmoqqa yopishadi (px bilan, .07s),
              `scale(1.14)`, barmoq ostidagi ikonka rangi jonli (`navTint`), qo'yganda `pillTr` prujina bilan
              eng yaqin bo'limga; 2) `swMove`: sahifa surilganda pastki doira ham yuradi (yarim ekran = 1 bo'lim,
              bittadan oshmaydi, menyu ichida qoladi); `swEnd`: doira yangi bo'limga yoki joyiga qaytadi.
           Tashxis: v1.10 kodida doira tugma joylariga sakrardi (`pillX(navHit)`) — v1.10 maketidan farq qilgan.
Sinov:     JSX OK; soxta baza: telefon oq/qora (sichqoncha + barmoq bilan menyu, sahifa chap/o'ng/ozgina/
           vertikal/chekka), PC oq/qora chap menyu, planshet, ombor/moder rollari — xato yo'q, ikonka ranglari
           React holati bilan mos.

## ⏳ YARIM QOLDI — YANGI DIZAYN KODGA TUSHMOQDA (2026-10-10) — HOZIRGI ASOSIY ISH

Ibrohim: «saytga yoz; push qil = main'ga yangi versiyada push». Savollarga javoblari (2026-10-10):
  oq rejim → «Oqqa ham moslab chiz» (avval oq varianti MAKETDA, keyin kod);
  tugma/tanlangan → oq, matni qora; telefon pastki menyu → faqat ikonkalar; v1.08 → «Ha, boshla».
Qilingan:  v1.08 PRODDA — umumiy uslub (faqat ko'rinish, hisob-kitob yo'q):
           `THEMES.dark` yangi ranglar + yangi tokenlar ikkala temada: accTxt, glass, glassB, nav, navOn, glow;
           shrift Inter Tight; `.app-layout` fonida `t.glow`; `s.card`/`s.iBtn`/`s.sheet`/`s.numXl`/`Btn`;
           sarlavha (shaffof, 42px shisha tugmalar, balandlik 60 → `#main-scroll` calc(100vh - 60px));
           PC menyu chiplar; `mobile-nav` suzuvchi pill (aria-label bilan); `pcCommon` box/kpi/h2/Tile;
           t.acc fonli 21 joyda oq matn → `t.accTxt` (aks holda oq ustida oq bo'lardi).
Qolgan:    1) oq rejim maketi (Artifact) → «shunaqa qil» → kod;
           2) sahifalar ichi maketdagidek: Bosh (grafik sotuv/to'lov, «Oylik reja», «Qarz xavfi», «Ombor holati»),
              Do'konlar (o'lchagich, kartochkalar), Ombor ro'yxati, Sotuv modali — bular YANGI HISOB-KITOB
              (LOGIKA): har biri uchun avval ta'rif/qaror Ibrohimdan;
           3) markazdagi binafsha shar-tugma (pastki menyuda) — yangi amal, qaror kerak.
Keyingi qadam: oq rejim maketini ko'rsatish (maketga oq variant qo'shish, shu havolaga).
Javobsiz savol: «Oylik reja 91/100», «Qarz xavfi», «Ombor holati %», «Vitrina band 68» qanday hisoblanadi?
⏳ Ko'rinmas nomlar (2026-10-10): Ibrohim «ha tuzatib push qil, lekin oldin mockupda ko'rsat».
           Maket: https://claude.ai/artifact/D83QfYR9wwDsvKduKEyr4g (haqiqiy kod, soxta ma'lumot, oldin/keyin).
           Sabab: tugmada `color` yo'q → brauzer qora qiladi. Avtomatik tekshiruv 2 joy topdi:
           `WarehousePage` kategoriya tugmasi (index.html:2327) va `StoresPage` do'kon kartochkasi (index.html:2363).
           Tuzatish: `color: t.txt` (har biri 1 qator); oq rejim piksel bo'yicha o'zgarmaydi. Kod YOZILMAGAN.
           Javobsiz savol: A (faqat Ombor) yoki B (Ombor + Do'konlar, tavsiya)? → «shunaqa qil» → v1.09 → push main.
⏳ Kartochka foni (2026-10-10): Ibrohim skrinshot bilan «qora fon bo'lgani yoqmadi» (do'kon kartochkalari).
           Xuddi shu maketga (versiya 2) variantlar qo'shildi — haqiqiy ilova, faqat dark `t.card` + `s.card` foni:
           A Shisha rgba(255,255,255,.07)+blur · B Olxo'ri #3A1A2A→#24111B · C Kulrang #2A→#1F ·
           D pastgacha olxo'ri fon (glow 100%) + Shisha. Hammasida nomlar tuzatilgan. Kod YOZILMAGAN.
           Javobsiz savol: A/B/C/D? Tanlangani `pcCommon` box/kpi ga ham qo'llanadi.
⚠ 2026-10-10 (keyin): Ibrohim «to'g'risi bu dizayn ham yoqmay qoldi» — v1.08 (Vaulta uslubi) ham yoqmadi.
           A/B/C/D javobsiz qoldi. Prodda v1.08 turibdi. Keyingi qadam: nima yoqmaganini va yo'nalishni so'rash
           (v1.08 qolsinmi / v1.07 ga qaytarishmi / boshqa namuna). Kod YOZILMAGAN.
⏳ OCHROQ VARIANTLAR (2026-10-10, HOZIRGI): Ibrohim javobi — «v1.08 qolsin, ustida ishlaymiz»,
           yoqmagani: «rangini ochartir» + «juda qorong'i / og'ir».
           Maket (versiya 3, shu havola): https://claude.ai/artifact/D83QfYR9wwDsvKduKEyr4g —
           haqiqiy ilova rasmlari, faqat THEMES ranglari almashgan (shakllar v1.08 dagidek), nomlar tuzatilgan:
           1 «Olxo'ri» (tavsiya) — THEMES.dark: bg #3A1B30, surf/card #4A2A3E, border #64435A, sub #D7C3CE,
             dim #9E8394, glass rgba(255,255,255,.14)/glassB .20, nav rgba(74,42,62,.92), navOn #2C1424,
             glow: radial(rgba(240,179,159,.55)) + linear(#8A4A62 0%, #6A3550 22%, #52273F 50%, #3A1B30 100%),
             `.app-layout` backgroundSize "100% 100%"; s.card dark bg rgba(255,255,255,.10), border rgba(255,255,255,.16).
           2 «Yumshoq kulrang» — bg #2C2729, surf/card #3B3538, border #544C50, sub #CBC2C6, dim #8E8589,
             nav rgba(59,53,56,.94), navOn #211D1F, glow linear(#6E4553 0px, #4E3740 200px, #2C2729 520px);
             s.card dark linear(#423B3E,#383234), border rgba(255,255,255,.10).
           1 va 2 da umumiy: acc #FFFFFF, accTxt #141113, green #6FE0A0, red #FF7A8C, amber #F3D08A, blue #F0B39F.
           3 «Ochiq» — THEMES.light: bg #F7EFF1, card #FFFFFF, border #EBDDE2, acc #412330 (tugma olxo'ri, matn oq),
             txt #2A1520, sub #7B6871, red #C8324A, green #23864F, amber #A9731A, blue #B5644E,
             glass rgba(65,35,48,.06)/glassB .10, navOn rgba(65,35,48,.10),
             glow radial(rgba(232,161,137,.55)) + linear(#F3D6CF 0px, #F6E4E6 220px, #F7EFF1 480px).
           Nomlar tuzatishi: `WarehousePage` kategoriya tugmasi va `StoresPage` do'kon kartochkasi stiliga `color: t.txt`.
           Javobsiz savol: 1, 2 yoki 3? → «shunaqa qil» → v1.09 (ranglar + nomlar) → push main.
❌ 2026-10-10 (keyin): Ibrohim «bo'lmadi, umuman yoqmadi, yangi UI dizayn jo'nataman» — 1/2/3 HAMMASI RAD.
           KUTILMOQDA: Ibrohim yangi UI namunasini (rasm) yuboradi. Kelganda: rasmlarni piksel bo'yicha o'lchab,
           haqiqiy ilova rasmlari bilan maket → «shunaqa qil» → kod. Prodda v1.08 qoladi (Ibrohim: «qolsin»).
           Nomlar tuzatishi (`color: t.txt`, 2 joy) hali kodda YO'Q — yangi dizayn bilan birga yoki alohida.
⏳ YANGI UI — OQ-KO'K DASHBOARD (2026-10-13, HOZIRGI ASOSIY ISH): Ibrohim rasm yubordi (oq dashboard:
           chap ikonka menyu, oq kartochkalar mini-grafiklar bilan, bitta ko'k gradient kartochka, o'ng «My tasks»
           paneli) — «shu ranglardan shu stilda qil».
           Ranglar (piksel): fon #F2F4F5, kartochka #FFFFFF r16, matn #20252E, kulrang #6B6F78, ko'k #2F63F6
           (gradient #4A7EFD→#1E50F4), grafik to'ldirish #E7EFFD, yorliq yashil #E9F5EC/#197560,
           qizil #FFE7E9/#AA2F45, ko'k #E3EBFE/#2F5BEA, menyu pill #E1E4ED, segment #F3F5F7. Shrift Inter, raqam 700.
           Maket: https://claude.ai/artifact/5bEnVoW76xZUFLjVcT52T9 — kompyuter (chap menyu + «Ombor oldi-berdi»
           kartochkalari + o'ng «Do'konlar» paneli = bizning 2 panelli PC), planshet, telefon (Bosh, Do'konlar).
           Taklif: 1-bosqich v1.09 = ranglar, oq kartochkalar, PC chap ikonka menyu + o'ng panel, telefon pastki menyu;
           2-bosqich = kartochkalardagi mini-grafiklar (YANGI HISOB — har biri uchun qaror).
           Javobsiz savollar: uslub shu bo'lsinmi? qora rejim qolsinmi / sayt doim oq ochilsinmi? Kod YOZILMAGAN.
⏳ FAQAT RANGLAR (2026-10-13, HOZIRGI): Ibrohim «diagrammalarni ko'paytirib tashlama, ranglarini ol faqat».
           Maket (shu havola, versiya 2): https://claude.ai/artifact/5bEnVoW76xZUFLjVcT52T9 — haqiqiy ilova,
           tuzilish v1.08 dagidek, faqat THEMES.light almashgan (+ nomlar tuzatishi):
           light: bg #F2F4F5, surf/card #FFFFFF, border #E6E8EE, acc #2F63F6, accSoft #2F63F61A, accTxt #FFFFFF,
           txt #20252E, sub #6B6F78, dim #A3A7B0, green #197560, greenS #E9F5EC, red #CE2B45, redS #FFE7E9,
           amber #A86A00, amberS #FFF3DC, blue #2F63F6, blueS #E3EBFE, glass #FFFFFF, glassB #E6E8EE,
           nav rgba(233,236,241,0.96), navOn #FFFFFF, glow none.
           Taklif: sayt doim oq ochilsin (useState default: saved===null → false), oy/quyosh tugmasi qoladi.
           Javobsiz savol: ranglar shu bo'lsinmi? sayt doim oq ochilsinmi? → «ha» → v1.09 → push main. Kod YOZILMAGAN.
           + Maket versiya 3 (2026-10-13): Ibrohim menyu rasmini yubordi «faqat iOS'dagidek shunaqa dumaloq qil» →
           kompyuter va planshetda chap dumaloq menyu: `.sidebar` 96px (padding 12px), ichida 68px pill r34 `t.rail`
           (#E1E4ED), tepada 48px ko'k «K», ikonkalar 56px pill r28 `t.railIn` (#D0D5E2) ichida, gap 12, tugma 44px
           doira, tanlangani `t.surf` + soya, boshqasi #4B505B; pastda foydalanuvchi harfi. PC da `nav.pc-only` (tepadagi
           chiplar) yashirildi, `.sidebar` PC da ham ko'rinadi, `.main-content` margin-left 96px (planshet/PC).
           Telefon pastki menyusi o'zgarmadi. Tokenlar: light rail/railIn; dark rgba(255,255,255,.07).
⏳ iPHONE BELGISI (2026-10-13): Ibrohim «iPhone ekraniga Safari'dan chiqarganda logosini, iconini qil».
           Hozirgi `index.html:14` apple-touch-icon — SVG data-URI (eski binafsha-feruza «K») → iOS SVG ni qabul
           qilmaydi. Maket: https://claude.ai/artifact/9jpNtio7tHzE5U2BppXr9h — 3 variant PNG 180×180:
           A ko'k gradient #4A7EFD→#1E50F4 + oq «K» (Inter 700); B oq fon + ko'k #2F63F6 «K»; C ko'k + «Kabir» / «ERP».
           Reja: repoga YANGI fayl `apple-touch-icon.png` (180×180) + 14-qator havolasi shu faylga — yangi fayl =
           Ibrohim ruxsati kerak (CLAUDE.md §11). Belgilar manbasi: HTML+Inter → Playwright (scratchpad/icon/).
           Javobsiz savol: A/B/C? fayl qo'shishga ruxsat? Kod YOZILMAGAN.
           + versiya 2: Ibrohim «qoraga tilla qil» → A/B/C o'rniga: D qora fon (radial #1C1B19→#050505) + tilla «K»
           (gradient #FBE9B7→#E8C26A→#C9972F→#F3D88E→#B9862A, Inter 700); E shu ranglarda «Kabir» / «ERP».
           Javobsiz savol endi: D yoki E? fayl qo'shishga ruxsat?
✅ v1.09 PRODDA (2026-10-13): Ibrohim «D» + «birato'la dizayni bilan push qil tekshiraman». Kodga tushdi:
           THEMES.light yangi ranglar (yuqoridagi «FAQAT RANGLAR» qiymatlari) + rail/railIn tokenlar ikkala temada;
           `App` dark useState: saved===null → false (sukut OQ) [MEN qarori, Ibrohimga aytildi];
           `.sidebar` → chap dumaloq menyu (PC + planshet, `nav.pc-only` yashirin, `.main-content` margin 96px);
           `WarehousePage` kategoriya tugmasi va `StoresPage` do'kon kartochkasiga `color: t.txt`;
           `index.html:14` apple-touch-icon → PNG data-URI 180×180 (D, 128 rang, ~8.5 KB) — yangi fayl QO'SHILMADI.
           Agar iPhone data-URI belgini olmasa → alohida `apple-touch-icon.png` fayl (Ibrohim ruxsati bilan).
           Sinov: JSX OK; soxta baza: PC/planshet/telefon, oq/qora, superadmin/moder/ombor, hamma sahifa, login,
           sukut rejim = oq, belgi 180×180 yuklanadi — xato 0.
Keyingi qadam: Ibrohim saytda tekshiradi; telefonda eski belgini o'chirib, Safari'dan qayta «Bosh ekranga qo'shish».
⏳ KO'RSATKICHLAR 4 BO'LAK (2026-10-13): Ibrohim «yoqmagani — 4 bo'lak bo'lib qolgan ko'rsatkichlari, nima qilsak bo'ladi?»
           [MEN tushunishim] PC `PcOmborPane` tepasidagi 4 ta `kpi` kartochka (Keldi/Do'konga ketdi/Sotildi/Omborda).
           Maket: https://claude.ai/artifact/LW3cHx3BtH223DVfp6TpLY — haqiqiy ilova: A bitta `box` ichida 4 ustun,
           ingichka `hair` chiziq (tavsiya); B 2×2, raqam 38px; C bitta `box` ichida 4 qator ro'yxat.
           Javobsiz savol: A/B/C? «Do'konlar» ustidagi 3 kartochka (`DokonlarPane`) ham shu usulda bo'lsinmi? Kod YOZILMAGAN.
           + versiya 2: Ibrohim «iOS'da bosilib emas, surilib o'tadi — shuni ham qo'sh, mockupda ko'rsat» → D varianti:
           4 kartochka bir qatorda, gorizontal surish (overflow-x auto + scroll-snap x mandatory, kartochka 78% eni,
           keyingisining cheti ko'rinadi), pastda nuqtalar (joriy = ko'k cho'ziq). Maketda JONLI namuna (suriladi).
           Kompyuterda to'rttasi sig'adi → u yerda A. Javobsiz savol endi: A/B/C/D?
⏳ MENYU SURIB O'TISH (2026-10-13): Ibrohim (chap menyu rasmi bilan) «bular ham, mobildagilar ham surilib o'tadigan
           bo'lishi kerak». Jonli namuna: https://claude.ai/artifact/BL4JTGnpQoyYVAv43dgqTf
           1) menyudagi oq doira (telefon pastki menyu + PC/planshet chap menyu) silliq surilib o'tadi —
              absolute «pill» + transition .38s cubic-bezier(.3,1.35,.5,1);
           2) menyu ustida barmoq bilan surib tanlash (pointerdown/move/up, touch-action:none, qo'yganda tanlanadi);
           3) telefonda sahifani chapga-o'ngga surib bo'lim almashtirish (scroll-snap x, har bo'lim 100% eni).
           Kodga o'tkazishda: 3) uchun `renderPage` bitta sahifa chizadi → 6 sahifani yonma-yon chizish yoki
           surish imo-ishorasini ushlab setTab — bu LOGIKA/tuzilish qarori (Screen naqshi, ichki holat), avval ayt.
           Javobsiz savol: 1/2/3 har biri ha/yo'q? Kod YOZILMAGAN.
✅ v1.10 PRODDA: Ibrohim «ha, shuni push qil» → uchalasi ham kodda (yangi HOOK YO'Q):
           `SW` (Screen yonida, modul darajasidagi oddiy obyekt) — sahifa surish holati;
           navItems dan keyin: `goTab`, `navIdx`, `pillX`/`pillY` (oq doira joyi, CSS transition .38s),
           `navHit` + `navDrag(axis)` (pointer: 8px dan ko'p surilsa — barmoq ortidan, qo'yganda goTab),
           `swStart/swMove/swEnd` (#main-scroll touch: faqat ≤480px; input/select va gorizontal aylanadigan
           ichki joylar o'tkazib yuboriladi; 70px dan ko'p → qo'shni bo'lim, chetda 0.25 qarshilik).
           `.swipe-pg` o'rami renderPage atrofida; #main-scroll overflowX hidden.
           Telefon menyusi: tugmalar flex:1, `[data-pill]` absolute; chap menyu: `[data-pill]` top = 8+i*56.
           Sinov: bosish/surib tanlash/sahifa surish (CDP touch)/vertikal/chet — to'g'ri; regressiya xato 0.
Ochiq: ko'rsatkichlar A/B/C/D (https://claude.ai/artifact/LW3cHx3BtH223DVfp6TpLY) javobsiz.
⏳ YUKLANISH EKRANI (2026-10-13): Ibrohim «load qilayotganda ekranda eski dizayn ko'rinishi qolib ketgan».
           Sabab: `App` `if (loading)` bloki THEMES.dark + «M · Mebel ERP» (eski); undan oldin statik
           `body{background:#080810}` (index.html:28) va `<meta name="theme-color" content="#080810">` (9-qator).
           Maket: https://claude.ai/artifact/EPc4hMpH4damovWwHqAxmt — A oq fon + ko'k «K»; B oq fon + qora-tilla
           «K» belgi (tavsiya); C qora fon + tilla «K». Javobsiz savol: A/B/C? Kod YOZILMAGAN.
✅ v1.11 PRODDA: Ibrohim «B ni qilib push qil». Statik `.boot` CSS (head) + `#root` ichida boot markup (React
           createRoot uni almashtiradi) + kichik oddiy <script> belgini apple-touch-icon havolasidan oladi;
           `App` `if (loading)` ham `.boot` (o'sha belgi); body bg #F2F4F5, theme-color #F2F4F5.
           Sinov: statik splash (ilova kodisiz) va loading holati bir xil; regressiya + menyu sinovlari xato 0.
✅ v1.12 PRODDA: Ibrohim «D ni qilib push qil» (ko'rsatkichlar). `PcOmborPane` 4 ta kpi → `.kpi-strip` + `.kpi-it`
           + `.kpi-dots` (CSS head'da): (pointer:fine) = bitta kartochka 4 ustun (A); (pointer:coarse) = scroll-snap
           surish, kartochka 78% (maks 300px), nuqtalar onScroll bilan (hook yo'q). Ranglar CSS o'zgaruvchilari orqali
           (--kc/--kb/--kh/--kd/--ka). Telefondagi HomePage 6 ta kartochkasi O'ZGARMAGAN. «Do'konlar» 3 kartochkasi
           (`DokonlarPane`) ham O'ZGARMAGAN — Ibrohim javob bermagan.
           Sinov: PC sichqoncha (oq/qora) = A; iPad 1180 barmoq = surish, nuqtalar 1000→0010→0001; regressiya xato 0.

## ⏸ (bajarildi → yuqorida) YANGI DIZAYN «1:1» MAKETI (2026-10-10)


Ibrohim: «qani manga to'g'ri mockup jo'nat, man yuborgan rasmlarimga umuman yaqin emas» →
           «rasmdagi ranglar, dizayn hammasini 1:1 qilib ERP'ga dizayn qil, PC, TABLET, PHONE bilan».
Maket:     https://claude.ai/artifact/REU5tztaMQ37N2ByomxAyk (oddiy HTML Artifact, soxta ma'lumot).
           Manba: `scratchpad/kabir-d/kabir-dizayn.html` (bulutda o'chadi — yagona nusxa Artifact).
           Rasmlar (Vaulta Analytics, ikonka plitkalari, palitra) piksel bo'yicha o'lchangan:
           ekran tepasi #6A3247→#451A36→#3B152D→qora, kartochka #111111, plitka #101010–#2C2C2C,
           kasr raqam #CFB5C9, shrift Inter Tight 300–600.
           Telefon 4 ekran: Bosh (Analytics nusxasi: chiplar, katta raqam, oltin+pushti grafik,
           «Oylik reja 91/100» shar+yoylar, «Qarz xavfi» o'lchagich, «Ombor holati» ustunchalar),
           Do'konlar (Signals: 68 o'lchagich, binafsha «Vitrina band», kartochkalar+nuqta ustunlar),
           Ombor (Assets: ogohlantirish kartochkasi shar+2 tugma, mahsulot qatorlari),
           Sotuv yozish (Exchange: 2 shisha kartochka, oq aylana, oq tugma, raqam klaviaturasi).
           Planshet 834×1194: grafik tepada, chapda reja+o'lchagich+ustunchalar, o'ngda ogohlantirish+ro'yxat.
           Kompyuter: 1 monitor, 2 ekran — chap «Ombor oldi-berdi», o'ng «Do'konlar».
Kod:       YOZILMAGAN. Prodda hozir v1.07.
Keyingi qadam: Ibrohim maketni ko'radi → BITTA-BITTA tuzatish (har gap alohida nashr, shu havolaga) →
           «shunaqa qil» → TAXMIN BLOKI → kod sahifama-sahifa (v1.08…).
Javobsiz savol: maket rasmlarga yetarlicha yaqinmi, nimani o'zgartirish kerak?
Eslatma:   oldingi A/B/C/D variantlar maketi (pastda) — Ibrohim «yaqin emas» degan, endi shu yangisi asosiy.

## ⏸ (eski) YANGI DIZAYN TANLOVI — A/B/C/D variantlar (2026-10-09)

Ibrohim (v1.07 dan keyin): «umuman yoqmadi; dizaynni eskisidan olmagin, o'zing boshqa dizayn qil,
           mockupda variant ko'rsat» + «uslubi xuddi 2 ta ekran 1 ta monitorda bo'lsin».
Maket:     https://claude.ai/artifact/6ff1rKagzSst6EJ27rUsvo (Design canvas, soxta ma'lumot) —
           3 variant, har biri kompyuter (2 ekran: chap Ombor, o'ng Do'konlar) + telefon:
           A «Yong'oq» — iliq qog'oz fon, Fraunces serif raqamlar, yong'oq-jigarrang urg'u;
           B «Grafit» — qora fon, Manrope, oltin urg'u, foyda + kunlik sotuv ustunchalari;
           C «Ish stoli» — oq, Geist/Geist Mono, ixcham jadvallar, chapda ikonka-menyu, yashil urg'u.
           Hammasida ikonkalar rangsiz chiziqli; rang faqat bitta urg'u + qarz qizil.
           + D (2026-10-10) — Ibrohim Behance «Vaulta AI trading app» skrinshotlarini yubordi
           («shundan ol ranglarni, dizaynini»): qora fon, tepada #412330→#E8A189 nur, oltin #EEC77A,
           oq, kulrang #868586; shisha kartochkalar; ingichka katta raqamlar; to'q kvadrat-plitkali
           kulrang ikonkalar; oltin/pushti chiziqli grafik; yoy-o'lchagich; oltin ustunchalar;
           suzuvchi tab bar markazida binafsha shar. D da 3 ekran: kompyuter (2 ekran),
           telefon Bosh, telefon «Sotuv yozish» (raqam klaviaturasi bilan). Behance sayti bulut
           tarmog'ida bloklangan (www.behance.net) — faqat skrinshotlardan.
Kod:       YOZILMAGAN. Prodda hozir v1.07 (Ibrohimga yoqmagan iOS/rangsiz urinish).
Keyingi qadam: Ibrohim A/B/C (yoki aralash) tanlaydi → maket BITTA-BITTA tuzatiladi →
           «shunaqa qil» → TAXMIN BLOKI → kod sahifama-sahifa (v1.08…).
Javobsiz savol: qaysi variant? (D eng yangisi, Ibrohim yuborgan uslubda)

## ⏸ iOS uslubi urinishi (2026-10-09) — v1.02…v1.07 prodda, Ibrohimga YOQMADI

Ibrohim: «boshidan dizaynini o'zgartir, iOS'dagidek qilish kerak, SVG'larni o'zgartir —
           10 $ lik ko'rinadi». Hozircha faqat superadmin ko'rinishi.
Branch:    `claude/pc-versiya` — v1.02 push qilindi va PRODGA chiqdi (Ibrohim: «push qil diganim prodga
           chiqar digani, deploy qil» → CLAUDE.md §8: «push qil» = prod).
Maket:     https://claude.ai/artifact/BqTVowKxnr1tgQ3SPYmoJ4 (Design canvas, soxta ma'lumot):
           PC Bosh (yorug'/qorong'i tugmasi), telefon Bosh, ikonkalar (hozirgi → taklif),
           hozirgi v1.01 skrinshotlari, «Qaror nuqtalari» va «Nega arzon ko'rinadi» stikerlari.
Taklif:    bitta shrift (Apple'da SF Pro, Windows'da Inter); iOS ranglari (fon #F2F2F7, oq
           kartochka, indigo #5856D6, yashil=pul, qizil=qarz); katta sarlavha; guruhlangan
           ro'yxatlar; rangli plitkadagi ingichka o'zim chizgan SVG ikonkalar; emoji yo'q;
           PC menyusi segment ko'rinishida. Ma'lumot/mantiq o'zgarmaydi — faqat ko'rinish.
Qarorlar (Ibrohim, 2026-10-09): maket «shunaqa qil»; rejim — ikkalasi, tugma bilan (hozirgidek);
           asosiy rang — iOS KO'K (maketdagi indigo emas); tartib — avval umumiy uslub, keyin
           sahifalar bittadan.
✅ v1.02 — umumiy uslub: `THEMES` qiymatlari iOS (kalitlar o'zgarmagan; light acc #007AFF, dark
           #0A84FF; card = surf = oq / #1C1C1E); shrift — head'dagi Outfit havolasi → Inter,
           `css` dan Sora/JetBrains @import olindi, font-family SF Pro → Inter; `s.mono`/`s.numXl`
           tabular-nums; `Ic` — chiziq 2 → 1.7, 26 ta menyu/tugma ikonkasi yangi (nomlari o'sha),
           mebel ikonkalari (table, sofa, armchair, cabinet, chair, bed, grid) shakli o'sha.
           Sinov: PC va telefon, yorug'/qorong'i, 5 sahifa, modal, moder, ombor — xato yo'q.
Qolgan (keyingi versiyalar, har biri alohida): sahifalar tuzilishi maketdagidek (Bosh PC+telefon,
           Ombor, Zakaz, Qarz, Hisobot, do'kon profili); emoji va KATTA HARFLI yorliqlar (`Lbl`,
           `Sec`); rangli ramkali kartochkalar; PC menyu segment ko'rinishi.
           Tegilmagan eski ranglar: login ekrani (qattiq yozilgan qorong'i ranglar), body foni
           (`useEffect [dark]` va tugma ichida #080810/#F2F2F8), `meta theme-color`, mijoz QR sahifasi.
Ibrohim (2026-10-09): «hamma o'zgarishni asosiy saytda qilib yubor» + «umuman iOS'ga o'xshamadi»
           → reja: v1.03 PC Bosh; v1.04 telefon Bosh; v1.05 menyular (PC segment, telefon tab bar,
           sarlavha tugmalari); v1.06 umumiy (emoji, KATTA HARFLI yorliqlar, rangli ramkalar, login).
✅ v1.03 — PC Bosh (`pcCommon`, `PcOmborPane`, `DokonlarPane`) maketdagidek; hisob o'sha. PRODDA.
✅ v1.04 — menyular: header shaffof + blur, PC `nav.pc-only` segment, o'ng tugmalar dumaloq,
           `mobile-nav` iOS tab bar (`Ic` ga ixtiyoriy `f` — to'ldirish rangi). PRODDA.
✅ v1.05 — telefon Bosh (`HomePage`) maketdagidek; `pcCommon()` dan F/hair/Tile qayta ishlatildi. PRODDA.
✅ v1.06 — umumiy: UI'dan emoji olindi (PAYMENT_INFO/ORDER_STATUS `emoji` maydoni qoldi, UI'da
           ishlatilmaydi); sahifa sarlavhalari 30px; `Lbl`/`Sec` KATTA HARFsiz; `s.inp` kulrang
           to'ldirilgan (16px — iPhone'da zoom bo'lmaydi); `s.iBtn` dumaloq; `s.card` hairline+soya;
           `Btn` 16px/600; login ekrani `t` ranglarida; body foni `t.bg`. Yangi ikonkalar: print,
           camera, lock. PRODDA.
           Tegilmagan (ataylab): log()/activity matnlari, alert/confirm matnlari, chop etiladigan
           yorliq/garantiya HTML, Telegram xabari, mijoz QR sahifasi (eski qorong'i ranglar),
           chop etish oynasi tugmalari (#7B73FF), planshet sidebar CSS ranglari (#101018),
           do'kon profilidagi gradient sarlavha.
✅ v1.07 — Ibrohim: «umuman yoqmadi, rang-barang bo'lib ketgan, iOS style qil, rangsiz icon SVG'lar
           bilan». Qaror [MEN]: ikonkalar rangsiz (kulrang fon + t.txt), raqamlar t.txt, faqat qarz
           t.red; tugmalar faqat iOS ko'k (`Btn` green/amber → t.acc), o'chirish qizil; pastki menyu
           tanlangani qora/oq; do'kon profili gradientsiz. PRODDA.
           Hali rangli qolganlar: zakaz holat yorliqlari (Badge), ogohlantirish qutilari (amberS),
           ProductModal tannarx qutisi (yashil fon), SellModal «Qarzga» qizil.
Keyingi qadam: Ibrohim prodda tekshiradi → tuzatishlar BITTA-BITTA (v1.08…).

## ✅ PC versiya (2026-10-09) — v1.01 prodda

Ibrohim: «endi KABIR ERPni maketda shakllantiramiz — PC versiya: chap tarafda ombor
oldi-berdi, foyda; o'ng tarafda klientlar».
Branch:    `claude/pc-versiya` (claude/sotuv-tolov + ombor-joyida-qolish merge) — push: HA, main'ga qo'shildi (fast-forward, 2026-10-09)
Maket:     https://claude.ai/artifact/QLgzuvDWmSc7zF5YL1wGMZ — Ibrohim: «shu yoqti» (tasdiqlandi)
Qarorlar (2026-10-09): klient = diler (do'kon); ikki ustun, o'rtasi yo'q; menyu tepada;
           davr — shu oy; PC'da «Bosh» o'rniga (telefon o'zgarmaydi); foyda — canSee("profit");
           avval Screen tuzatishi (v1.1); ikki qadam: v2 menyu tepaga, v3 yangi Bosh.
✅ v1.1 — `claude/ombor-joyida-qolish` merge qilindi (Screen).
✅ v2 — PC'da (>1024px) menyu tepada: `.pc-only` CSS + sarlavhadagi `nav.pc-only` (navItems'dan).
           Sinov: 1440/1024/700/400px va ombor roli — sidebar/menyu to'g'ri, xatolar yo'q.
✅ v3 — `PcHomePage` (renderPage «home»: `.pc-block` PC'da, `.mob-block` telefonda). Ibrohim:
           «klientlar emas — Do'konlar», o'ng tomon ham shu qadamda. Maket v2 ham shunga moslandi.
           [MEN] qarorlar: jadval units/sales/to'lovlardan + «Qaytdi» activity'dan; keldi = «Sexdan»;
           tannarx canSee("cost"); do'konlar oxirgi amal bo'yicha saralanadi; oy — UTC (ReportPage kabi).
           Sinov: superadmin/moder/telefon, do'kon bosilsa profil — xatolar yo'q.
✅ v4 — Ibrohim: «Do'konni tepadagi menyudan chiqar; Ombor/Zakaz/Hisobot bosilganda o'ngdagi
           Do'konlar qolsin». Qarorlar: hamma sahifada (Qarz ham); do'kon bosilsa profil CHAPDA,
           o'ng ro'yxat qoladi; telefon menyusida Do'kon qoladi (faqat PC); omborchida o'ng panel yo'q.
           Kod: `PcHomePage` → `pcCommon` + `PcOmborPane` (chap, Bosh) + `DokonlarPane` (o'ng);
           `#main-scroll` ichida `.pc-split` (1fr 1fr, o'ng `.pc-side` sticky);
           PC `nav.pc-only` da `navItems.filter(id !== "stores")`.
           [MEN] qarorlar: ustunlar teng; o'ng panel sticky; qidiruv sahifa almashganda saqlanadi;
           profildagi «← Do'konlar» o'zgarmadi (bosilsa chapda eski do'konlar ro'yxati ochiladi).
           Sinov: superadmin 5 sahifa, do'kon bosish, moder, omborchi, 400/1024px — xatolar yo'q.
✅ v1.01 — Ibrohim: «v1.01 qil». Kod = v4, faqat belgi v4 → v1.01. Bundan keyin +0.01
           (v1.02, v1.03…) — CLAUDE.md §5 yangilandi.
⚠ PROD — 2026-10-09: Ibrohim «vercel preview kerak emas, push qilgandan keyin kirib tekshiraman»
           — Claude buni PROD deb tushundi, so'radi, «Ha, prodga chiqar» tanlandi → `main` e0323b8 →
           b9ca49f (fast-forward). Keyin Ibrohim: «prodga qo'shma, push qil diman, tekshiraman» —
           NOTO'G'RI tushunilgan edi. Qaror: «Qolsin» — v1.01 prodda qoladi, revert yo'q.
           Qoida (CLAUDE.md §8): «push qil» = faqat ish branch'i; Ibrohim push'dan keyin versiyani
           o'zi solishtiradi; preview havola berilmaydi; prod faqat «prodga chiqar» bilan.
Yo'nalish (Ibrohim, 2026-10-09): «endi faqat SUPERADMINni to'g'irlaymiz, keyin qolgan ishlarni
           qilamiz» — hozircha o'zgarishlar superadmin ko'rinishi uchun; boshqa rollar (admin, moder,
           ombor) va to'xtatilgan ishlar (sotuv/to'lov tahriri, PDF) — keyin.
Keyingi qadam: Ibrohim v1.01 ni tekshiradi → superadmin uchun keyingi o'zgarish v1.02 (BITTA-BITTA).
Javobsiz savol: Ibrohimning tekshiruvi natijasi.
Eslatma:   hozirgi PC'da brend «Mebel ERP» (sidebar) — maketda «Kabir ERP».

## ⏸ TO'XTATILGAN — sotuv va to'lovni tahrirlash/o'chirish (2026-10-09; PC maketi ustuvor)

Branch:    1-qadam va v1 `main`da (claude/pc-versiya orqali). 2-qadam yangi `claude/*` branch'da `main`dan.
Maket:     https://claude.ai/artifact/XhhrDbaA74qHjcEHtEm17A (v2: qarorlar + 1-qadam rejasi)
Qarorlar (Ibrohim, 2026-10-09):
  - Qayerda: `StoreProfile` → Sotuv va To'lov ro'yxatlari. Qarz va Hisobot sahifasida YO'Q.
  - Kim: superadmin va admin.
  - Sotuv o'chirilsa: unitlar o'sha do'kon vitrinasiga qaytadi (status "available").
  - Sotuvda tahrirlanadi: sana, mijoz, summa, to'lov usuli. Soni/mahsulot/do'kon — YO'Q.
  - Tartib: 1) $400 → 2) to'lov o'chirish → 3) to'lov tahrir → 4) sotuv o'chirish → 5) sotuv tahrir.
✅ 1-qadam ($400) — branch `claude/sotuv-tolov`: `StoreProfile` → `allPayments` endi qisman
           to'lovlar + faqat qolgan qism. Soxta baza: $1.1K/7 qator → $650/5 qator = Hisobot.
           PDF (`pdfStore`, index.html:619) — TEGILMADI (Ibrohim A/B demadi → B: alohida qadam).
✅ v1 — versiya belgisi: 1-qator `<!-- v1 -->`, `APP_VER`, sarlavhada «Do'kon v1».
Keyingi qadam: 2-qadam — to'lovni o'chirish (avval maket, keyin «ha»).
Javobsiz savol: PDF ham tuzatilsinmi?

## Ochiq branchlar (main'ga merge qilinmagan)

- Yo'q (2026-10-09). `claude/pc-versiya` va `claude/ombor-joyida-qolish` `main`ga qo'shildi —
  remote'dagi branchlar o'chirilmagan (o'chirish — Ibrohim qarori).

## ⬜ Navbatda (Ibrohim tanlaydi)

- ✅ SONLARNI 0 QILISH — v1.24 PRODDA (2026-10-13). Maket: https://claude.ai/artifact/Sxp3CPzHU84XwYwGW2FU7m (tarix pastda)
  Ibrohim: «sozlamalarga ombordagi narsalar sonini, keyin do'kondagi narsalar sonini 0 qiladigan qil — biz to'ldiramiz»
  → «menga 0 qilishni mockupda ko'rsat». KOD YO'Q. Maketda: sozlamalar menyusida «Sonlarni 0 qilish» (superadmin) →
  oyna (Ombor / har do'kon, sonlari, belgilash) → tasdiq (vitrina qarzi qancha kamayishi) → natija. Raqam misoli A/B.
  Qarorlar (tavsiya): 1) A hisobdan chiqarish — units.status uchinchi qiymat (masalan `nol`), dona bazada qoladi, raqam
  davom etadi (B — o'chirish: generateUnitId soni bo'yicha → sotilgan/eski yorliq bilan takror); 2) oynada tanlanadi;
  3) faqat superadmin; 4) qayta kiritilganlarga yangi yorliq; 5) oylik «Kelgan» shunday qolsin; 6) qaytarish tugmasi hozir
  yo'q. Tegiladigan joylar: sozlamalar menyusi, ombor donalar ro'yxati (~2525 «0 qilingan»), yozuv units+activity.
  Taxminiy versiya v1.21. Keyingi qadam: Ibrohim «shunaqa qil»/1–6 → TAXMIN BLOKI → kod.
  Eski eslatma: KOD YO'Q — avval MAKET (LOGIKA: unitlarni o'chiradi). Maketda ko'rsatiladigan
  muammolar: unit ID soni bo'yicha (`AddStockModal`, existingCount) — o'chirilgach yangi yorliqlar eski chop etilgan
  ID'larni takrorlaydi (§10 ochiq muammo 4); sotilgan unitlar QOLISHI shart (sales.unit_ids); soya rejimida o'chirish
  daftarga ham ketadi; kim qila oladi (faqat superadmin?); qaysi do'kon / hammasi; tasdiq oynasi.
- Tahlildagi tezkor tuzatishlar (har biri alohida sikl, avval maket): QR `#p=SKU` havolasi
  ilovani yiqitishi; PDF kirill/ʻ shrifti; PDF holat ranglari; chop HTML da nomlarni tozalash.
- Xavfsizlik: standart parollarni almashtirish, repo'ni private qilish — Ibrohim o'zi
  (GitHub / Firebase console). Haqiqiy himoya (Firebase Auth + Firestore qoidalari) — katta qaror.

## ❓ Javobsiz savollar

- Soxta baza sinov vositalari repoga (`sinov/`) qo'shilsinmi?
- CLAUDE.md §6 «Nimaga tegilmaydi» ro'yxati — Ibrohim tasdiqlaydimi?

## ✅ Oxirgi tugaganlar

- 2026-10-09 — v1.01 prodga chiqdi: PC versiya (menyu tepada, Bosh'da ombor oldi-berdi, o'ngda
  Do'konlar hamma sahifada), ombor tahririda joyida qolish, do'kon profilida to'lov ikki marta
  sanalmasligi, versiya belgisi, qoidalar fayllari.
- 2026-10-08 — Tilla ERP `CLAUDE.md` qoidalari Kabir'ga moslandi (branch `claude/claude-md`).
  Ibrohim qarorlari: push faqat aytganda; workflow to'liq taqiq; `.vercelignore` qo'shildi;
  versiya Tilla kabi to'liq.
- 2026-10-08 — ombor tahririda joyida qolish tuzatishi (branch `claude/ombor-joyida-qolish`).
- 2026-10-08 — butun loyiha tahlili (natijalari CLAUDE.md §10 da).
