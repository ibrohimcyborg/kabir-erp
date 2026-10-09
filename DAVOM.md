# DAVOM.md — qayerdan davom etamiz

> Har seans boshida o'qiladi. Ish qoidalari — `CLAUDE.md`.
> Har o'zgarishdan keyin DARHOL yangilanadi.

**Oxirgi yangilanish:** 2026-10-09 · main = e0323b8 (2026-07-10) · versiya: v2 (`claude/pc-versiya`, main'da hali yo'q)

## ⏳ YARIM QOLDI — PC versiya maketi (2026-10-09) — HOZIRGI ASOSIY ISH

Ibrohim: «endi KABIR ERPni maketda shakllantiramiz — PC versiya: chap tarafda ombor
oldi-berdi, foyda; o'ng tarafda klientlar».
Branch:    `claude/pc-versiya` (claude/sotuv-tolov + ombor-joyida-qolish merge) — push: yo'q
Maket:     https://claude.ai/artifact/QLgzuvDWmSc7zF5YL1wGMZ — Ibrohim: «shu yoqti» (tasdiqlandi)
Qarorlar (2026-10-09): klient = diler (do'kon); ikki ustun, o'rtasi yo'q; menyu tepada;
           davr — shu oy; PC'da «Bosh» o'rniga (telefon o'zgarmaydi); foyda — canSee("profit");
           avval Screen tuzatishi (v1.1); ikki qadam: v2 menyu tepaga, v3 yangi Bosh.
✅ v1.1 — `claude/ombor-joyida-qolish` merge qilindi (Screen).
✅ v2 — PC'da (>1024px) menyu tepada: `.pc-only` CSS + sarlavhadagi `nav.pc-only` (navItems'dan).
           Sinov: 1440/1024/700/400px va ombor roli — sidebar/menyu to'g'ri, xatolar yo'q.
Keyingi qadam: Ibrohim v2 skrinshotini ko'radi → «ha» bo'lsa v3: PC Bosh sahifa (chap: ombor
           oldi-berdi + foyda; o'ng: klientlar), maketdagidek.
Javobsiz savol: v2 ma'qulmi → v3 ga o'taymi?
Eslatma:   hozirgi PC'da brend «Mebel ERP» (sidebar) — maketda «Kabir ERP».

## ⏸ TO'XTATILGAN — sotuv va to'lovni tahrirlash/o'chirish (2026-10-09; PC maketi ustuvor)

Branch:    `claude/sotuv-tolov` (claude/claude-md ustida — qoidalar fayllari ham shu branch'da)
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
Javobsiz savol: PDF ham tuzatilsinmi? Tekshirish uchun push / «prodga chiqar»?

## Ochiq branchlar (main'ga merge qilinmagan)

- `claude/ombor-joyida-qolish` @ 6454f56 — PUSH QILINGAN, `claude/pc-versiya` ga merge qilingan (v1.1). Ombordagi mahsulotni tahrirlab
  saqlaganda kategoriya va scroll joyida qoladi (sahifalar `Screen` orqali chiziladi;
  do'kon profili tabi va zakaz filtri ham saqlanadi). Soxta baza bilan brauzerda sinalgan.
  Ibrohim tekshiradi → PR yoki main'ga qo'shish qarori.
- `claude/claude-md` — CLAUDE.md, DAVOM.md, CHANGELOG.md, .vercelignore. Push: Ibrohim aytganda.

## ⬜ Navbatda (Ibrohim tanlaydi)

- v1: `index.html` 1-qatoriga `<!-- v1 -->` + `APP_VER` (alohida sikl, maket bilan;
  APP_VER ekranda ko'rinadimi — Ibrohim qarori).
- Tahlildagi tezkor tuzatishlar (har biri alohida sikl, avval maket): QR `#p=SKU` havolasi
  ilovani yiqitishi; PDF kirill/ʻ shrifti; PDF holat ranglari; chop HTML da nomlarni tozalash.
- Xavfsizlik: standart parollarni almashtirish, repo'ni private qilish — Ibrohim o'zi
  (GitHub / Firebase console). Haqiqiy himoya (Firebase Auth + Firestore qoidalari) — katta qaror.

## ❓ Javobsiz savollar

- `claude/ombor-joyida-qolish` — PR ochilsinmi yoki to'g'ridan main'ga qo'shilsinmi?
- `claude/claude-md` push qilinsinmi? (bulut seansi tugasa push qilinmagan ish yo'qoladi)
- Soxta baza sinov vositalari repoga (`sinov/`) qo'shilsinmi?
- CLAUDE.md §6 «Nimaga tegilmaydi» ro'yxati — Ibrohim tasdiqlaydimi?

## ✅ Oxirgi tugaganlar

- 2026-10-08 — Tilla ERP `CLAUDE.md` qoidalari Kabir'ga moslandi (branch `claude/claude-md`).
  Ibrohim qarorlari: push faqat aytganda; workflow to'liq taqiq; `.vercelignore` qo'shildi;
  versiya Tilla kabi to'liq.
- 2026-10-08 — ombor tahririda joyida qolish tuzatishi (branch `claude/ombor-joyida-qolish`).
- 2026-10-08 — butun loyiha tahlili (natijalari CLAUDE.md §10 da).
