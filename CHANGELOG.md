# CHANGELOG — Kabir ERP

> Arxiv: YOZILADI, O'QILMAYDI. Yangi yozuv TEPAGA. Parol, kalit, mijoz ma'lumoti yozilmaydi.

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
