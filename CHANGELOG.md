# CHANGELOG — Kabir ERP

> Arxiv: YOZILADI, O'QILMAYDI. Yangi yozuv TEPAGA. Parol, kalit, mijoz ma'lumoti yozilmaydi.

## v1.25 — 2026-10-14 — 0 qilingan donalar tarixdan chiqadi
Do'kon hisoboti, do'kon PDF, ombor oldi-berdi va do'konlar ro'yxatida 0 qilingan donalar «jo'natildi» bo'lib ko'rinmaydi.

## v1.24 — 2026-10-13 — Sonlarni 0 qilish
Superadmin sozlamalarida «Sonlarni 0 qilish»: tanlangan ombor/do'kondagi sotilmagan donalar hisobdan chiqadi (holat «nol»,
dona o'chmaydi, raqam davom etadi). Sotuv, qarz, to'lov tegilmaydi. Ombor ro'yxatida «0 qilingan».

## v1.23 — 2026-10-13 — Telefonda surish va scroll
Ro'yxat tepaga/pastga yetganda butun ekran cho'zilmaydi; sahifani yonga surganda tik scroll bo'lmaydi; boshqa bo'limga
o'tilganda sahifa tepadan ochiladi (faqat telefon).

## v1.22 — 2026-10-13 — Hisobot tugmalari dumaloq
Do'kon hisobotidagi «Hammasi | Bu oy» va tur filtri iOS kabi to'liq dumaloq; davr tugmasida ham oq belgi suriladi.

## v1.21 — 2026-10-13 — Do'kon hisoboti
Do'kon profilida 5-bo'lim «Hisobot»: jo'natildi / sotildi / qaytdi / pul olindi tarixi hozirgi bazadan (faqat o'qiydi),
«Hammasi | Bu oy», tur bo'yicha filtr, kunlar bo'yicha yig'ilgan. Bo'lim tugmalari yonga suriladi va dumaloq.

## v1.20 — 2026-10-13 — DAFTAR soya rejimi
Ilova eski jadvallardan ishlaydi; db o'rami har muvaffaqiyatli yozuvni orqa fonda `kabir` daftariga ham yuboradi (id bir xil,
xatosi ilovaga chiqmaydi). Superadmin: daftar bo'sh bo'lsa birinchi nusxa, kuniga bir marta solishtirish (`kabir_soya/holat`),
bulut belgisida rangli nuqta + oyna («O'tishga tayyorlik N/7»). `daftar.js`: amallar soni (`jami`).

## daftar d1 — 2026-10-13 — DAFTAR 2-bosqich: Firebase qoidasi
`firestore.rules`: eski jadvallar avvalgidek ochiq; daftar (`kabir`, `TEST_kabir`) — faqat qo'shish (ol==1, server vaqti),
o'zgartirish/o'chirish yo'q; navbat faqat +1 va o'z qatori bilan birga. `sinov/qoida.test.mjs` — emulyatorda 7/7 (Firebase 10.14.1).

## daftar d1 — 2026-10-13 — DAFTAR 1-bosqich: dvigatel (ilovaga ulanmagan)
`daftar.js` — Kabir jadvallari uchun daftar dvigateli (Tilla g'oyasi, kod qayta yozilgan): yassi kalitlar, amal → bitta
qator, ombor qulfi (navbat raqami, amal qayta quriladi), navbat, bo'laklar, imzo, ko'chirish/tekshirish. `sinov/` —
soxta Firestore + 25 sinov. Tilla'dan farqli tuzatish: o'z yozuvlari cloudda boshqa tartibda tushsa telefon ajralmaydi.

## v1.19 — 2026-10-13 — hamma qidiruvda «×» (bir bosishda tozalash)
- Do'kon qidirish (telefon sahifasi va kompyuter paneli), Kategoriya qidirish, Shu kategoriyada qidirish: yozuv bor paytda o'ngda kulrang «×»; bosilsa yozuv o'chadi, kursor qidiruvda qoladi.

## v1.18 — 2026-10-13 — kompyuterdagi do'kon qidiruvi ham nomi, manzili, menejeri va telefoni bo'yicha
- Bosh sahifadagi «Do'konlar» panelida «Do'kon qidirish» endi telefondagidek qidiradi (avval faqat nom bo'yicha edi).

## v1.17 — 2026-10-13 — telefondagi Do'konlar sahifasiga qidiruv
- Sarlavha ostida «Do'kon qidirish» qatori: nomi, manzili, menejeri va telefoni bo'yicha (raqamlar bo'shliqsiz ham topiladi); «Topildi: X / N ta», bo'sh natijada «Hech narsa topilmadi». Kompyuterdagi qidiruv o'zgarmagan (faqat nom).

## v1.16 — 2026-10-13 — oyna ochiq paytda orqadagi sahifa qimirlamaydi, sana maydoni oynaga sig'adi
- Har qanday oyna (11 ta) ochiq turganda orqadagi sahifa qulflanadi: surish orqaga o'tmaydi, Safari paneli kichraymaydi. Uzun oynaning ichi avvalgidek suriladi.
- iPhone'da sana maydoni oynadan chiqib turmaydi (6 ta sana maydoni).

## v1.15 — 2026-10-13 — telefonda ro'yxat pastda ham menyu ustida xiralashadi
- Telefonda ro'yxat pastki menyuga yaqinlashganda xiralashib yo'qoladi (tepadagidek); oxirigacha surilganda oxirgi kartochka to'liq ko'rinadi (pastki bo'shliq safe-area bilan).

## v1.14 — 2026-10-13 — telefonda ro'yxat tepada iPhone kabi xiralashib yo'qoladi
- Telefonda (≤480px) ro'yxat sarlavha ostidan o'tadi: tepaga yaqinlashganda xiralashadi va asta yo'qoladi (keskin kesilmaydi). Planshet/PC o'zgarmagan.

## v1.13 — 2026-10-13 — menyu doirasi Telegram kabi barmoqqa yopishib yuradi
- Pastki va chap menyuni ushlab surganda oq doira tugmadan tugmaga sakramaydi, barmoq ortidan silliq yuradi, biroz kattalashadi; qo'yganda eng yaqin bo'limga o'tiradi.
- Telefonda sahifani chapga-o'ngga surganda pastki menyudagi doira ham birga yuradi.

## v1.12 — 2026-10-13 — «Ombor oldi-berdi» ko'rsatkichlari surib o'tiladi
- Telefon/iPad (barmoq bilan) da Keldi/Do'konga ketdi/Sotildi/Omborda bir qatorda chapga-o'ngga suriladi, pastda nuqtalar.
- Sichqonchali kompyuterda to'rttasi bitta kartochka ichida, ingichka chiziq bilan ajratilgan (4 ta alohida bo'lak emas).

## v1.11 — 2026-10-13 — yangi yuklanish ekrani
- Sayt ochilayotganda eski «M · Mebel ERP» qora ekran o'rniga: och kulrang fon, qora-tilla «K» belgi (iPhone belgisi bilan bir xil), «Kabir ERP».
- Ekran ilova kodi yuklanguncha ham ko'rinadi; boshidagi to'q ko'k lahza va theme-color ham yangi fonga almashdi.

## v1.10 — 2026-10-13 — menyu iOS kabi surib o'tiladi
- Menyudagi oq doira (telefon pastki menyusi va kompyuter/planshet chap menyusi) bo'limdan bo'limga silliq surilib o'tadi.
- Menyu ustida barmoq bilan surib bo'lim tanlash mumkin; telefonda sahifani chapga-o'ngga surib qo'shni bo'limga o'tiladi.

## v1.09 — 2026-10-13 — oq-ko'k ranglar, chap dumaloq menyu, iPhone belgisi
- Oq rejim yangi ranglarda (Ibrohim yuborgan dashboard rasmidan): fon #F2F4F5, oq kartochka, ko'k #2F63F6, matn #20252E. Sayt sukut bo'yicha oq ochiladi; oy/quyosh tugmasi qoldi.
- Kompyuter va planshetda menyu chapda — dumaloq tik panel (iOS uslubi), tanlangani oq doirada; PC tepasidagi menyu tugmalari olib tashlandi.
- iPhone bosh ekrani belgisi: qora fonda tilla «K» (PNG). Qora rejimda ko'rinmay qolgan kategoriya va do'kon nomlari tuzatildi.

## v1.08 — 2026-10-10 — yangi qora dizayn: umumiy uslub (Behance «Vaulta» uslubi)
- Qora rejim ranglari: fon #020202 + tepada olxo'ri–shaftoli nur, kartochka #111, urg'u oq (matni qora), oltin #EEC77A, pushti #E8A189. Shrift Inter Tight, katta raqamlar ingichka.
- Sarlavha shaffof, tugmalar shisha kvadratchalar; kompyuter menyusi chiplar (tanlangani oq); telefon pastki menyusi suzuvchi, faqat ikonkalar.
- Tugmalar dumaloq-oq; oq rejim ranglari o'zgarmagan (alohida maket kutilmoqda). Hisob-kitob o'zgarmagan.

## v1.07 — 2026-10-09 — rangsiz ikonkalar, kam rang

Ibrohim: «rang-barang bo'lib ketgan, rangsiz ikonkalar bilan». Rangli plitkalar va avatarlar
kulrang fonli qora/oq ikonkaga o'tdi; raqamlar qora, faqat qarz qizil; tepa panel, pastki menyu,
do'kon profili (gradient o'rniga oq kartochka, iOS segment) rangsiz; yashil/sariq tugmalar
bitta iOS ko'k tugmaga. O'chirish tugmalari qizil qoldi.

## v1.06 — 2026-10-09 — umumiy iOS tozalash

Ilova ekranlaridan emoji olib tashlandi (sarlavha, tugma, ro'yxat, holat yorliqlari); sahifa
sarlavhalari katta; KATTA HARFLI mayda yorliqlar oddiy yozuvga; maydonlar iOS kabi kulrang
to'ldirilgan, ramkasiz; rangli ramkali kartochkalar oddiy; tugmalar va oyna yumshoqroq; login
ekrani tanlangan rejim ranglarida. Bazaga yoziladigan matnlar, chop etiladigan yorliq/garantiya,
Telegram xabari va mijoz QR sahifasi o'zgarmagan.

## v1.05 — 2026-10-09 — telefon Bosh iOS uslubida

Telefondagi Bosh: katta sarlavha, ogohlantirishlar ro'yxat ko'rinishida rangli plitka bilan,
6 ta oq kartochka (rang faqat raqamda), tez amallar dumaloq tugmalar, eng foydali mahsulotlar
ro'yxati. Hisob-kitob o'zgarmagan.

## v1.04 — 2026-10-09 — menyular iOS uslubida

Tepa panel shaffof, PC menyusi iOS segment ko'rinishida, o'ng tugmalar dumaloq ramkasiz,
telefondagi pastki menyu iOS tab bar kabi (tanlangan ikonka to'ldirilgan, chiziq olib tashlandi).

## v1.03 — 2026-10-09 — PC Bosh iOS uslubida

Kompyuterda «Ombor oldi-berdi» va «Do'konlar» maketdagidek: rangli plitkali ikonkalar, oq
kartochkalar, harakatlar jadval o'rniga iOS ro'yxat, do'konlar ro'yxati yumaloq harf bilan.
Hisob-kitob o'zgarmagan. Yangi ikonkalar: tray, bag, banknote, undo.

## v1.02 — 2026-10-09 — iOS uslubi: ranglar, shrift, ikonkalar

Butun ilovada: iOS ranglari (yorug' va qorong'i, asosiy rang — iOS ko'k), bitta shrift (Apple'da
SF Pro, qolganida Inter), menyu va tugma ikonkalari yangi ingichka chizmalar. Sahifa tuzilishi va
hisob-kitob o'zgarmagan. Maket: iOS dizayn maketi (Design canvas).

## v1.01 — 2026-10-09 — raqamlash qaytadan

Kod v4 bilan bir xil, faqat versiya belgisi v4 → v1.01. Bundan keyin har o'zgarish +0.01:
v1.02, v1.03… (Ibrohim qarori). Pastdagi v1…v4 — eski raqamlash.

## v4 — 2026-10-09 — PC'da Do'konlar o'ngda doim

Kompyuterda tepa menyudan «Do'kon» olib tashlandi. O'ngdagi «Do'konlar» paneli endi hamma
sahifada (Bosh, Ombor, Zakaz, Qarz, Hisobot) turadi; do'kon bosilsa profili chapda ochiladi,
o'ng ro'yxat joyida qoladi. Omborchida o'ng panel yo'q. Telefon va planshet o'zgarmagan.

## v3 — 2026-10-09 — PC'da yangi Bosh sahifa

Kompyuterda «Bosh» o'rniga ikki ustun: chapda «Ombor oldi-berdi» (shu oy: keldi, do'konga ketdi,
sotildi, omborda; foyda bloki; harakatlar jadvali), o'ngda «Do'konlar» (vitrinadagi mol, qarz,
olingan pul, qidiruv; bosilsa profil ochiladi). Telefon o'zgarmagan. Bazaga yozuv yo'q.

## v2 — 2026-10-09 — PC'da menyu tepada

Kompyuterda (1024px dan keng) chap menyu yashiriladi, tepada «Kabir ERP» + versiya + menyu
tugmalari (Qarz raqami bilan). Planshet va telefon o'zgarmagan. PC versiyaning 1-qadami.

## v1.1 — 2026-10-09 — ombor tahririda joyida qolish

`claude/ombor-joyida-qolish` qo'shildi: sahifalar barqaror `Screen` orqali chiziladi —
tahrirlab saqlaganda kategoriya va scroll joyida qoladi, do'kon profili tabi va zakaz filtri
saqlanadi. PC versiya (v2, v3) uchun asos. Branch: `claude/pc-versiya`.

## v1 — 2026-10-09 — versiya belgisi

`index.html` 1-qatori `<!-- v1 -->`, `APP_VER = "v1"`, sarlavhada sahifa nomi yonida «v1».
Shu versiyada: do'kon profilida to'lov ikki marta sanalmaydi (pastdagi yozuv).

## 2026-10-09 — do'kon profilida to'lov ikki marta sanalmaydi

«Pul olish» bilan yopilgan sotuv do'kon profilida (OLINGAN PUL, To'lov ro'yxati) ikki marta
sanalardi. Endi qisman to'lovlar + faqat qolgan qism. Hisobot bilan teng. Faqat ekran
(`StoreProfile`). Do'kon PDF'ida xuddi shu xato hali bor — alohida qadam.

## 2026-10-08 — qoidalar tizimi (versiyasiz, index.html ga tegilmadi)

`CLAUDE.md` (Tilla ERP qoidalaridan moslangan), `DAVOM.md`, `CHANGELOG.md`, `.vercelignore`
(*.md saytda ochilmasin). Branch: `claude/claude-md`.

## 2026-10-08 — ombor tahririda joyida qolish (main'ga merge qilinmagan)

Sahifalar App ichidagi komponent bo'lgani uchun har App renderida qayta yaratilib, tanlangan
kategoriya va scroll yo'qolardi. Barqaror `Screen` komponenti qo'shildi. Branch:
`claude/ombor-joyida-qolish` @ 6454f56.

## Boshlang'ich holat

main = e0323b8 (2026-07-10). Bungacha tarix faqat git'da: commitlar GitHub veb orqali
(«Update index.html», «Add files via upload»).
