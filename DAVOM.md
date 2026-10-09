# DAVOM.md — qayerdan davom etamiz

> Har seans boshida o'qiladi. Ish qoidalari — `CLAUDE.md`.
> Har o'zgarishdan keyin DARHOL yangilanadi.

**Oxirgi yangilanish:** 2026-10-09 · main = e0323b8 (2026-07-10) · versiya: hali yo'q (§5)

## ⏳ YARIM QOLDI — sotuv va to'lovni tahrirlash/o'chirish (2026-10-09)

Branch:    kod yo'q — faqat maket
Qilingan:  maket https://claude.ai/artifact/XhhrDbaA74qHjcEHtEm17A (HOZIRGI vs TAKLIF + tashxis)
           Tashxis: do'kon profilida «OLINGAN PUL $400» — PayModal bilan yopilgan sotuv ikki marta
           sanaladi (index.html:2199–2200, `StoreProfile` → `allPayments`); haqiqatda $200.
           Kartochkada mahsulot nomi yo'q — mahsulot o'chirilgan bo'lishi mumkin (taxmin).
Qolgan:    Ibrohim 6 ta savolga javob beradi (maketda): $400 ni avval tuzatishmi, unitlar qayerga
           qaytadi, kim tahrirlaydi, nima tahrirlanadi, Qarz sahifasida kerakmi, tartib.
Keyingi qadam: javobdan keyin 1-qadam (taklif: $400 tuzatish) — alohida sikl.
Javobsiz savol: maketdagi 1–6 savollar.

## Ochiq branchlar (main'ga merge qilinmagan)

- `claude/ombor-joyida-qolish` @ 6454f56 — PUSH QILINGAN. Ombordagi mahsulotni tahrirlab
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
