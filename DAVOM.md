# DAVOM.md — qayerdan davom etamiz

> Har seans boshida o'qiladi. Ish qoidalari — `CLAUDE.md`.
> Har o'zgarishdan keyin DARHOL yangilanadi.

**Oxirgi yangilanish:** 2026-10-09 · main = `claude/pc-versiya` bilan bir xil · versiya: **v1.05 — PRODDA** (2026-10-09)

## ⏳ YARIM QOLDI — iOS uslubidagi yangi dizayn (2026-10-09) — HOZIRGI ASOSIY ISH

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
Keyingi qadam: v1.06 — umumiy: emoji, KATTA HARFLI yorliqlar (`Lbl`, `Sec`), rangli ramkali
           kartochkalar, `s.card`/`s.iBtn`/`s.inp`, login ekrani va body foni ranglari.

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
