# Kabir ERP

Ibrohim Mirikromov loyihasi — Kabir Exclusive (mebel ishlab chiqarish, Yangiyo'l) uchun ERP:
ombor, do'konlarga jo'natish, sotuv, qarz, zakaz, hisobot, yorliq/garantiya chop etish.
Single-file `index.html` (React 18 + Babel brauzerda), Firebase Firestore, `api/pdf.py` (Vercel).
Prod: kabir-erp.vercel.app — `main`dan avtomatik deploy. Repo **PUBLIC**.

Bu qoidalar Tilla ERP `CLAUDE.md` sidan moslangan (2026-10-08). Tilla'ga xos narsalar
(POS, hamid, Tilla faktlari) olib tashlangan — Kabir'da ular YO'Q.

---

## 0. SEANS BOSHIDA — birinchi ish

1. `DAVOM.md` ni o'qi. Hozirgi holat, ochiq branchlar, yarim qolgan ish, keyingi vazifa —
   hammasi shu yerda. Checkout qilingan branch'da yo'q bo'lsa (ish `main`ga merge qilinmagan):
   `git fetch origin` → `git show origin/<ish-branch>:DAVOM.md`.
2. Git holatini tekshir:
   ```bash
   git status --short; git branch --show-current
   git fetch origin; git log --oneline -3 origin/main
   git branch -r --no-merged origin/main      # main'ga merge qilinmagan ish branchlari
   ```
   - `DAVOM.md` dagi `main = <hash>` `origin/main` bilan mos kelmasa — Ibrohim `main`ni o'zi
     o'zgartirgan (u `index.html` ni GitHub veb orqali ham yuklaydi). Ibrohimga ayt; qator
     raqamlarini eskirgan deb hisobla.
   - Merge qilinmagan `claude/*` branch bo'lsa — Ibrohimga ayt. O'zing merge qilma, o'chirma.
   - Versiya belgisi joriy qilingach (§5): `head -1 index.html` va `APP_VER` ni solishtir.
     Mos kelmasa Ibrohimga ayt, o'zing tuzatma.
3. **`CHANGELOG.md` ni O'QIMA.** U faqat arxiv — yozasan, o'qimaysan. Commit xabarlariga ham
   tayanma (`main`dagi eski commitlar «Update index.html»). Eski holat kerak bo'lsa — `git diff`.
4. **Kod haqidagi haqiqat — kodning O'ZI.** `DAVOM.md` ham, bu fayl ham noto'g'ri bo'lishi
   mumkin — shubha bo'lsa `grep` bilan kodni och. Hujjatga tayanib xulosa chiqarma.
5. **Ikki loyiha aralashmasin.** Bu muhitda Tilla ERP repo'si ham bo'lishi mumkin. Har yozish,
   commit va push oldidan:
   ```bash
   git remote get-url origin                     # …/kabir-erp
   grep -c 'projectId: "kabir-erp"' index.html   # 1
   grep -ci 'tilla' index.html api/pdf.py        # 0 va 0
   ```
   **Nega bu bor:** 2026-07-03 14:04 da `main`ga (eb91963) Kabir o'rniga **Tilla ERP ning
   `index.html`i** tushgan (`projectId: "tilla-erp-8b357"`), 69 soniyadan keyin qaytarilgan.
   Tilla'dan kod, funksiya yoki qaror ko'chirilmaydi.

---

## 0.2. ISH QOIDALARI

- **Javoblar o'zbek tilida.**
- **Workflow / ko'p agent / worktree ISHLATILMAYDI** — ultracode yoqilgan bo'lsa ham.
  Ibrohim (2026-10-08, Kabir uchun): *«Tilla kabi to'liq taqiq»*. Bitta faylli loyihada
  keraksiz va qimmat; worktree ikkinchi `index.html` qoldiradi, keyingi seans o'shani o'qib
  eski holatga qarab qoladi. Qolib ketgan worktree ko'rsang — Ibrohimga ayt, o'zing o'chirma.
- **Bir vaqtda BITTA o'zgarish, bitta javob.**

---

## 0.1. UZLUKSIZLIK — seans uzilsa ham ish TO'XTAMASIN

Ibrohim ko'pincha **telefondan, bulut seansida** (claude.ai/code) ishlaydi: mockupni telefonda
ko'radi, «o'zgartir» yoki «yoz, push qil» deydi. Seans uzilishi, kontekst siqilishi, yangi
seans ochilishi mumkin — shunda **yangi seans hech narsa so'ramasdan davom eta olishi shart**.
Buning yagona kafolati — `DAVOM.md`.

Bulut seansi (`echo $CLAUDE_CODE_REMOTE` → `true`) PC'dan farq qiladi:
- har seans **yangi mashina**: `main`dan sayoz clone + yangi `claude/*` branch;
- **push qilinmagan commit, scratchpad, mockup fayli konteyner bilan YO'QOLADI**;
- kontekst to'lganda ogohlantirishsiz avtomatik siqiladi.

1. **`DAVOM.md` HAR o'zgarishdan keyin DARHOL yangilanadi** — seans oxirini kutmaydi.
   Kod → `DAVOM.md` (+ `CHANGELOG.md`) → bitta commit. Uchtasi bitta ish.
2. **Push faqat Ibrohim aytganda** (§8). Shuning uchun har o'zgarish tugagach javob oxirida
   bitta qator: `Push qilinmagan: <branch> @ <hash> — push qilaymi?` Bulutda bu ish seans
   tugasa yo'qoladi — Ibrohim buni bilishi shart.
3. **Yarim qolgan ish** `DAVOM.md` ga shunday yoziladi:
   ```
   ⏳ YARIM QOLDI — <nima> (<sana>)
   Branch:    <claude/...> @ <hash> — push: ha/yo'q
   Qilingan:  <aniq nima tushdi> — index.html:<qator> (<komponent/funksiya nomi>)
   Qolgan:    <aniq nima qolgan>
   Keyingi qadam: <bitta jumla>
   Maket:     <Artifact havolasi, bo'lsa>
   Javobsiz savol: <bor bo'lsa>
   ```
   Qator raqami siljiydi — yoniga doim komponent/funksiya nomini yoz. Hech qachon
   «davom etyapman» deb qoldirma.
4. **Mockup DOIM Artifact qilib chiqariladi** — Ibrohim telefonda ochadi. Havolani javobda
   ber **va `DAVOM.md` ga yoz** (bulutda mockup fayli o'chadi, yagona nusxa — Artifact).
   Repo public — mockupga haqiqiy mijoz ismi, telefon, qarz, login, parol qo'yma; soxta ma'lumot.
5. Yangi seans birinchi xabari doim shu bo'ladi:
   > `CLAUDE.md` va `DAVOM.md` ni o'qi. `<branch>` dan davom etamiz.

   Boshqa hech narsa kerak bo'lmasligi kerak. Kerak bo'lsa — `DAVOM.md` kam yozilgan, tuzat.

### `/clear` / yangi seans tartibi

Suhbat uzaysa **Claude o'zi taklif qiladi**, Ibrohim eslatib turmaydi:
1. Claude avval `DAVOM.md` ni yangilaydi va commit qiladi.
2. «Suhbat uzaydi. DAVOM.md yangilandi (`<branch>` @ `<hash>`, push: ha/yo'q). Push qilib,
   /clear qilaylikmi?» — bulutda push qilinmasa, yangi seans `DAVOM.md` ni ko'rmaydi.
3. Ibrohim `/clear` yozadi yoki yangi seans ochadi, keyin 5-banddagi bitta qator.

⚠ **So'rashdan OLDIN `DAVOM.md` yozilgan bo'lishi shart.** Ibrohim «xop» deb darhol
tozalashi mumkin.
⚠ Ibrohim **hech qachon loyihani qaytadan tushuntirmaydi.** Yangi seans «qaysi ish?» deb
so'rashga majbur bo'lsa — `DAVOM.md` kam yozilgan, ayb Claude'da.

### ⚠️ `index.html` — avval GREP, keyin bo'lak

Fayl ~2 960 qator, ~195 KB, **~49k token**. Har to'liq o'qish kontekstni tez yeydi.
1. `grep -n` bilan kerakli joyni **top**. Komponentlar xaritasi:
   `grep -nE "^  const [A-Z][A-Za-z]*(Page|Modal|Profile) =" index.html`
2. Faqat o'sha komponentni yoki atrofidagi 20–80 qatorni o'qi.
3. Aniq blokni almashtir. Edit'dan keyin faylni qayta to'liq o'qima.

`api/pdf.py` (~22 KB) to'liq o'qilishi mumkin.

---

## 1. KOD YOZISH TARTIBI (eng muhim qoida)

### LOGIKA / MAYDON / HISOB-KITOB o'zgarsa

Bunday o'zgarishda **`index.html` ga ham, `api/pdf.py` ga ham TEGMA**.

1. Mockup qil — **Artifact**:
   - HOZIRGI holat vs TAKLIF
   - tashxis (nima buzuq, qayerda, nechanchi qator)
   - qaror nuqtalari — Ibrohim tanlashi kerak bo'lgan joylar
2. Havolani ber va **TO'XTA**. Kod yozma.
3. Ibrohim `"ha"` / `"to'g'ri"` / `"shunaqa qil"` / `"boshla"` degach — endi kod.

Bu qoida `"tekshir"`, `"to'g'irla"`, `"muammo bor"` deyilganda **ham** amal qiladi.
Muammoni topganingda ham avval mockup.

**Kabir'da LOGIKA nima** (`grep -n` bilan top):

| Soha | Qayerda |
|---|---|
| Sotuv summasi, chegirma, foyda | `SellModal` (`total`), `stats`, `ReportPage` |
| Qarz / to'lov | `PayModal`, `partial_payments`, `paid` |
| Unit holati va joyi | `units.status` (`available`/`sold`), `units.location` (`warehouse` / do'kon id) |
| Unit ID, zakaz raqami | `generateUnitId`, `ZK-` (`OrderModal`) |
| Rollar | `canSee`, `navItems`, `user?.role` shartlari |
| Firestore yozish/o'qish | `db` o'rami, `loadAll`, har `db.from(...)` chaqiruvi |
| PDF ma'lumoti | `pdf*` funksiyalari ↔ `api/pdf.py` `build_*` |
| Sana | `today()`, `now()`, oy kaliti |
| `localStorage` | `kabir_user`, `kabir_tab`, `kabir_dark` |

**Nega bu bor:** Kabir'da TEST rejimi yo'q (§7). Logika xatosi sinov paytidayoq haqiqiy savdo
ma'lumotiga yoziladi.

### SOF VIZUAL o'zgarish

Rang, matn, joylashuv, typo — mantiqqa tegmasa mockupsiz mumkin, **LEKIN oldin so'ra**:

> "Bu vizual o'zgarish, mockupsiz yozaman, rozimisan?"

`"ha"` degach yoz. Kabir'da vizual: `style={{…}}` qiymatlari, `THEMES`, `css` satri, ekran matni.

Ko'rinishi vizual, lekin **vizual EMAS** (= LOGIKA):
- `canSee(...)` / `user?.role` sharti ostidagi narsani ko'rsatish yoki yashirish — ruxsat.
- `fmt` / `fmtK` — natijasi `activity` yozuviga ham tushadi (bazada saqlanadi).
- `PAYMENT_INFO` / `ORDER_STATUS` kalitlari — bazada saqlanadi (faqat `label` vizual).
- PDF'dagi matn — `api/pdf.py` kalitlari bilan bog'liq (§10).

### Ikkilanish

Ikkilangan holat = **LOGIKA** deb hisobla, mockup qil. `"Bu oddiy-ku"` degan qarorni
**O'ZING qabul qilmaysan** — qaror doim Ibrohimdan chiqadi.

Kabir misoli: sahifa/modal komponentlari `App` ichida e'lon qilingan. Ularni ko'chirish yoki
o'rash «faqat chizish tartibi» bo'lib ko'rinadi, aslida forma qiymatlari va filtrlar saqlanib
qolish-qolmasligini o'zgartiradi. **Yangi sahifa yoki modal** qo'shishda naqshni (mavjud
`<X />` yoki `Screen`) jim tanlama — variantlarni Ibrohimga ayt.

### So'ralganidan ortiq ish qilma

So'ralgan narsani **aynan** qil — ortig'ini emas.

So'ralmasa **qilinmaydi**:
- rename, refactor, `"shu yerdaman, buniyam tuzatay"`
- so'ralmagan error handling, validatsiya, himoya tekshiruvlari
- `"tabiiy juftlik"` ko'ringan qo'shimcha funksiya
- tegishsiz qatorlarni qayta formatlash yoki tartiblash

Kabir'dagi tipik vasvasalar — **tegma, faqat ayt**: o'lik kod (§10), `SellModal` `error`
tekshirmasligi, `PayModal` dagi hook tartibi, `db` o'ramini qayta yozish, komponentlarni
`App` dan chiqarish. Ko'rgan xatoingni javob oxirida **bir qator** bilan ayt — tuzatish
alohida so'rov va alohida sikl.

**Bir turda bitta o'zgarish.** Kichik ko'rinsa ham ikkinchisini qo'shib yuborma.

### BITTA-BITTA — maket ustida ishlash tartibi (Ibrohim, 2026-08-23)

Ibrohim: *"man 1ta 1ta etaman, mockupda korsattasan, 'shunaqa qil' diman.
Har 1ta elementimni saqlab qolasan."*

Ibrohim maketni ko'rib ketma-ket bir nechta gap yozadi. **Ularni YIG'IB, bitta nashrda
chiqarish TAQIQLANADI.** Har gap alohida sikl:

1. Ibrohim **bitta** narsani aytadi
2. Maketda **FAQAT o'shani** o'zgartirasan — boshqa hech nimaga tegmaysan
3. Artifactni **o'sha havolaga** qayta nashr qilasan va **aynan nima o'zgarganini** bitta
   qator bilan aytasan
4. Ibrohim `"shunaqa qil"` deydi yoki tuzatadi
5. Keyingi gapga o'tasan

Ketma-ket uchta gap kelsa ham — **uchta alohida nashr**, uchta alohida javob.

⚠ **Har element saqlanadi.** Aytilmagan joyga tegilmaydi: rang, joylashuv, matn, bo'shliq —
hech biri "yo'l-yo'lakay" o'zgarmaydi. Tuzilishni qayta yozish kerak bo'lsa — avval ayt.
⚠ Bir necha gap **bir-biriga bog'liq** bo'lsa — **buni ochiq ayt**, o'zing qo'shib yuborma.

**Nega bu bor:** Tilla ERP da (2026-08-23) olti tuzatish bitta nashrga yig'ilgan. Ibrohim
aytmagan narsalar ham o'zgardi, qaysi xato qaysi so'rovdan kelgani yo'qoldi.

**Diff budjeti.** Boshlashdan oldin taxminan necha qator o'zgarishini ayt. Haqiqiy diff
(`git diff --stat`) shu taxmindan ~2 barobar oshsa — **to'xta va xabar ber**. Shishgan diff =
qamrov siljigan. Kabir'da JSX qatorlari uzun (inline `style`, ~1000 belgigacha) — uzun qatorga
tegsang `git diff --word-diff` bilan ham ko'r.

---

## 2. HAR KOD O'ZGARISHIDAN OLDIN — TAXMIN BLOKI

So'ralmasa ham, avtomatik, kodga o'tishdan oldin. **Mockup bor-yo'qligidan qat'i nazar.**

```
TAXMIN BLOKI

1. ANIQ BILMAYOTGAN JOYLARIM
   - <spetsifikatsiyadagi bo'shliqlar>        (bo'lmasa: "yo'q")

2. TAXMINLARIM
   - [MEN]  <bo'shliqni shunday to'ldiraman — qaror mendan>
   - [USER] <buni Ibrohim aniq aytgan>

3. TA'SIR QILADIGAN JOYLAR
   - <grep natijasi: maydon/funksiyani o'qiydigan HAMMA joy>
```

- 1-qism qulaylik uchun bo'sh qoldirilmaydi — bo'lmasa «yo'q» deb yoz.
- `[MEN]` belgili har qator — Ibrohim kodga aylanishidan oldin bekor qila oladigan qaror.
- 3-qism — **grep natijasi, eslash emas**. Kabir'da kamida:
  - ikkala nom shakli: baza `snake_case` (`unit_id`, `partial_payments`) **va** holat
    `camelCase` (`unitId`, `partialPayments`) — `loadAll` va har yozuvdagi qo'lda xaritalar;
  - `api/pdf.py` dagi kalitni o'qiydigan `build_*`;
  - chop HTML: `buildYorliqHtml`, `buildGarantiyaHtml`;
  - backup: `exportBackup` / `importBackup`;
  - pul, qoldiq yoki raqam bo'lsa: «shu payt boshqa telefon ham shu yozuvni o'zgartirsa?» (§10).

Keyin **kut**. `"ha"` / `"to'g'ri"` / `"shunaqa qil"` — boshlash signali. Jimlik signal emas.
Qisqa signal: Ibrohim `"taxmin?"` yoki `"3 savol"` deb yozsa — darhol shu blokni chiqar.

**Bir qatorli diff testi.** So'rovni bitta gap qilib yoz: `<nima> hozir <X> → <Y> bo'ladi`.
Detal o'ylab topmasdan yoza olmasang — so'rovni tushunmagansan. Kod boshlama, so'ra.

**Nega bu bor:** Ibrohim har safar "muammo nima" deb so'raydi, lekin 3-4 savoldan keyin bu
esdan chiqadi va taxmin jim kodga singib ketadi. Loyiha cho'zilishining asosiy sababi shu.

---

## 3. ESKI VERSIYALAR — DALIL EMAS

Faqat **ikki manba** bor:
1. Ibrohim hozir aytgan spetsifikatsiya
2. `origin/main` dagi `index.html` va `api/pdf.py` ning **HOZIRGI** kodi

«Eski versiya» Kabir'da: eski commitlar, merge qilinmagan `claude/*` branchlar, oldingi seans
xotirasi va **Tilla ERP kodi/qarorlari**. Ulardan **QAROR ko'chirma**.

- Mavjud funksiyani **chaqirish** — yaxshi
- Eski **qaror va taxminni** meros olish — yomon

`db` o'rami (`index.html` ~144–220) Supabase'ga o'xshaydi, lekin **Supabase EMAS** — Supabase
xulqini taxmin qilma (§10 «Tuzoqlar»).

**Nega bu bor:** Tilla'da v120 dagi `_kartaBor` qarori yangi panelga ko'chirildi va panel
buzildi.

---

## 4. GREP BIRINCHI, KOD KEYIN

Yangi funksiya yozishdan oldin `grep -n` bilan tekshir. id, maydon, status qiymati naqshlarini
**taxmin qilma** — kodda ko'r. Yangi maydon qo'shganda o'zgaruvchi nomini emas, **o'sha maydonni
o'qiydigan HAMMA joyni** grep qil — ikkala shaklda.

| Nima | Qidiruv |
|---|---|
| qarz / to'lov | `grep -n "partialPayments\|partial_payments"` (~11 joyda takrorlangan) |
| unit holati / joyi | `grep -n 'status === "\|location [!=]== "'` |
| to'lov usuli | `grep -n "payMethod\|pay_method\|PAYMENT_INFO\|pp.method"` |
| unit ID | `grep -n "unitId\|unit_id"` (`sales.unit_ids` unitId MATNINI saqlaydi) |
| PDF kaliti | `index.html` dagi `pdf*` ↔ `api/pdf.py` dagi `data.get(...)` — ikkala faylda |
| yozuvdan keyingi holat xaritalari | `grep -n "addedAt: u.added_at\|unitId: u.unit_id"` |

---

## 5. VERSIYA VA CHANGELOG

Ibrohim (2026-10-08): *«Tilla kabi to'liq»*.

- `index.html` ning **ENG BIRINCHI qatori**: `<!-- vN -->` — `<!DOCTYPE html>` dan **oldin**.
  Faqat raqam, boshqa hech narsa.
- `APP_VER` o'zgaruvchisi shu 1-qator bilan **doim bir xil**.
- `index.html` yoki `api/pdf.py` ning har o'zgarishida ikkalasi birga oshadi: v1 → v2 → …
  (kichik tuzatish: v2.1, v2.2).
- Commit sarlavhasi: `vN — <qisqa mazmun>` (o'zbekcha). «Update index.html» kabi hech narsa
  demaydigan sarlavha yozilmaydi.
- O'zgarishlar **tafsiloti** `index.html` ichiga **YOZILMAYDI** (`// v5: …` izohlari yo'q) —
  faqat `CHANGELOG.md` ga. Yangi yozuv **tepaga**: `## vN — <sana> — <mazmun>` + 1–3 qator.
- Repo public — `CHANGELOG.md` ga parol, kalit, mijoz ismi, summa YOZILMAYDI.

⏳ **Hali joriy qilinmagan** (`main` @ e0323b8: 1-qator `<!DOCTYPE html>`, `APP_VER` yo'q).
Birinchi versiyali o'zgarish `<!-- v1 -->` + `APP_VER` ni qo'shadi — bu `index.html`
o'zgarishi, shuning uchun alohida sikl, maket bilan (APP_VER ekranda ko'rinadimi — Ibrohim
qarori). Ungacha `index.html` ga tegmaydigan commitlar versiyasiz, mazmunli sarlavha bilan.

---

## 6. NIMAGA TEGILMAYDI (Ibrohim ruxsatisiz)

O'zgartirma, o'chirma, «tozalab» ham qo'yma. Kerak bo'lsa avval so'ra.

1. **Chop etiladigan formatlar.** Unit ID: `generateUnitId` → `` `${sku}-#${pad4(n)}` ``.
   QR havola: `` `${origin}/#p=${encodeURIComponent(sku)}` `` (`buildYorliqHtml`).
   **Nega:** unitId yorliq va garantiyada CODE128 bo'lib qog'ozga chiqadi, skaner aynan shu
   matn bo'yicha qidiradi; QR mijoz telefonida `#p=SKU` ni ochadi. Format o'zgarsa, chop
   etilgan yorliqlar o'qilmay qoladi.
2. **Firestore kolleksiya va maydon nomlari** (§10 jadval). Baza bitta, u ham prod — nom
   o'zgarsa eski yozuvlar migratsiyasiz ko'rinmay qoladi.
3. **Rol siyosati** — kim nimani ko'radi (`canSee`, `navItems`, ombor uchun narx yashirish,
   `price_incomplete`). G'alati ko'rinsa ham o'zing «tuzatma». Mavjud nomuvofiqliklar §10 da.
4. **Kalit va loginlar.** `firebaseConfig` (~100–107) va `DEFAULT_USERS` (~119–124).
   Qiymatlarini **HECH QACHON** javobga, commitga, `DAVOM.md`/`CHANGELOG.md`/bu faylga
   ko'chirma — faqat qator raqami bilan murojaat qil.

---

## 7. SINOV

### 7.0. Sintaksis-sinov — HAR o'zgarishdan keyin MAJBURIY

`node --check` bu loyihada **ishlamaydi** — kod `<script type="text/babel">` ichida, JSX.
Sinov brauzer qiladigan ishning o'zi: blokni ajratib, Babel bilan o'giradi.

```bash
B=/tmp/kabir-babel
[ -f "$B/node_modules/@babel/standalone/babel.min.js" ] || npm i --prefix "$B" --no-save --no-audit --no-fund --silent @babel/standalone@8.0.7
node -e '
const fs=require("fs"),B=require(process.argv[1]),f=process.argv[2];
const t=fs.readFileSync(f,"utf8"),tag="<script type=\"text/babel\">";
const n=t.split(tag).length-1;
if(n!==1){console.error("XATO: "+f+": text/babel bloki "+n+" ta (1 kutilgan)");process.exit(1)}
const a=t.indexOf(tag)+tag.length,z=t.indexOf("</script>",a);
if(z<0){console.error("XATO: "+f+": yopuvchi </script> yoq");process.exit(1)}
const code=t.slice(0,a).replace(/[^\n]/g," ")+t.slice(a,z);
try{B.transform(code,{filename:f,presets:[["react",{runtime:"classic"}]]});
console.log("OK: "+f+": Babel "+B.version+", JSX sintaksis toza")}
catch(e){console.error("XATO: "+String(e.message).split("\n")[0]);process.exit(1)}
' "$B/node_modules/@babel/standalone/babel.min.js" index.html
```
Natija: `OK: …` yoki `XATO: … (1304:12)` — qator raqami **`index.html` dagi haqiqiy qator**.
XATO chiqsa commit **QILINMAYDI**.
- Brauzer konsoli blok ichidagi raqamni beradi: `index.html` qatori = konsol qatori +
  (`grep -n 'text/babel' index.html` raqami − 1).
- Kod ichida `</script>` kerak bo'lsa, doim `<\/script>` deb yoz — aks holda brauzer blokni
  shu joyda kesadi.
- Qavs xatosida raqam xato **qilingan** joyni emas, **sezilgan** joyni ko'rsatadi — `git diff`
  ni ko'zdan kechir.
- `index.html` Babel'ni **versiyasiz** yuklaydi (unpkg `latest`; 2026-10-08 da 8.0.7). Sinov
  versiyasi shunga mos turadi.

`api/pdf.py` tegilgan bo'lsa:
```bash
PYTHONPYCACHEPREFIX=/tmp/kabir-pyc python3 -m py_compile api/pdf.py && echo "OK: api/pdf.py"
```
Mantiq o'zgarsa — har hisobot turini **to'ldirilgan** namunaviy payload bilan sina
(bo'sh `{"rows":[]}` qator chizish kodini umuman ishga tushirmaydi).

⚠ Sintaksis-sinov **runtime** xatoni ushlamaydi (hook tartibi, `undefined.map`, eski hujjatda
yo'q maydon). Ilovada ErrorBoundary yo'q — bunday xato hamma foydalanuvchida **oq ekran**.
Hook qo'shilgan yoki yangi maydon o'qiladigan o'zgarishdan keyin sahifa soxta baza bilan render
qilib ko'riladi (7.2).

### 7.1. Haqiqiy bazaga sinov yozuvi YOZILMAYDI

Kabir'da **TEST rejimi YO'Q**: bitta `firebaseConfig` (`projectId: "kabir-erp"`), kolleksiyalar
prefikssiz. Har yozuv — **Ibrohimning haqiqiy bazasiga**.
- `index.html` ni lokal ochish (`python3 -m http.server` ham) = prod bazaga ulanish.
- Vercel preview havolasi ham prod bazaga yozadi (konfiguratsiya muhitga qarab almashmaydi).
- **Login urinishi ham yozadi:** `users` da standart loginlardan biri yetishmasa, `fsGetAll`
  uni bazaga qayta yozadi.
- `enablePersistence` yoqilgan — offlayn yozuv ham keyin prodga ketadi.
- Claude haqiqiy bazaga ulangan sahifada hech narsa bosmaydi va saqlamaydi.

**Nega bu bor:** sinov yozuvi prodga tushsa, Ibrohim uni haqiqiy ombor, sotuv va qarz
hisobotlarida ko'radi va qaysi yozuv soxta ekanini ajratib bo'lmaydi.

### 7.2. Soxta baza bilan sinov (Playwright)

1. Chromium `https://kabir.test/` ni ochadi, `page.route('**/*')` HAMMA so'rovni ushlaydi:
   `kabir.test/` → lokal `index.html`; react/react-dom/babel → lokal npm nusxalari
   (`npm pack react@18.3.1 react-dom@18.3.1 @babel/standalone@8.0.7`);
   `firebase-app-compat.js` → xotiradagi soxta Firestore; qolgan `.js` → bo'sh;
   **qolgan hamma so'rov `abort`** — Firebase'ga bitta ham so'rov chiqmaydi.
2. `addInitScript`: `window.__FAKE_DB = <seed>`, `localStorage.kabir_user` (login chetlab
   o'tiladi), `kabir_tab`.
3. Soxta Firestore `index.html` ishlatadigan API ni qoplaydi: `initializeApp`, `firestore()`,
   `enablePersistence`, `collection(t).get()/.doc(id)`, `batch().set/update/delete/commit`.
   `index.html` yangi Firestore chaqiruvini ishlata boshlasa (`where`, `onSnapshot`,
   `runTransaction`, `FieldValue`) — soxtasi ham kengaytiriladi.
4. `pageerror` va `dialog` ro'yxatlari bo'sh bo'lishi shart (`alert("Baza xatosi")` = dialog).
5. Seed'da haqiqiy ism, telefon, parol bo'lmaydi.

Vositalar hozir repoda yo'q — har seans scratchpad'da qayta yoziladi. Repoga qo'shish
(`sinov/` + `.vercelignore`) — Ibrohim qarori.

---

## 7.1. TEKSHIRUV — `"tayyor"` deyishdan oldin

O'zgarish **yozilgani uchun** bajarilgan bo'lmaydi. **Tushganini isbotlaganingda** bajarilgan
bo'ladi. `git commit` dan oldin (va Ibrohim `"nima o'zgardi?"` desa):

```
TEKSHIRUV
So'ralgan: <bir qatorli: nima → nimaga>
Qilingan:  <haqiqatda nima o'zgardi>
Dalil:     index.html:<qator>   eski → yangi
Grep:      <maydon/funksiya> o'qiladigan joylar: <ro'yxat>
           — hammasi yangilandi / <qaysilari emas va nega>
Sinov:     JSX: OK | pdf.py: OK / tegilmadi | soxta baza: <natija> / qilinmadi
Qayerda:   <branch> @ <hash> — push: ha/yo'q — main'da: YO'Q (prodda ko'rinmaydi) / HA
```

`Dalil` ni haqiqiy qator raqami va haqiqiy eski → yangi bilan to'ldira olmasang — o'zgarish
tushmagan. `"Tayyor"` dema, shuni ochiq ayt. JSX `OK` bo'lmasa ham «tayyor» deyilmaydi.

Mockup **oldin** ko'rsatadi — HOZIRGI vs TAKLIF, bu **taklif**.
TEKSHIRUV **keyin** ko'rsatadi — eski → yangi, bu **dalil**. Biri ikkinchisining o'rnini bosmaydi.

Bajarilmagan ish «bajarildi» bo'lib ketishining odatiy yo'llari — har birini tekshir:
- edit noto'g'ri faylga, nusxaga, **noto'g'ri branch'ga** yoki **noto'g'ri repoga** tushgan
- faqat `camelCase` holat o'zgargan, bazadagi `snake_case` eski qolgan (yoki aksincha)
- `index.html` o'zgargan, `api/pdf.py` dagi `build_*` hali eski kalitni o'qiydi
- o'zgarish sinalmagan rolda ko'rinmaydigan `canSee` / `user?.role` sharti ostida qolgan
- matnda tasvirlangan, lekin edit haqiqatda qo'llanmagan
- JSX sintaksis-sinov (7.0) ishga tushirilmagan
- commit qilingan, lekin `main`ga tushmagan — Ibrohim kabir-erp.vercel.app da eski holatni ko'radi

### `"Ishlamadi"` deyilganda

Ibrohim `"o'zgarmadi"` yoki `"men so'ramagan narsa paydo bo'ldi"` desa:
- avval o'zgarish **prodda bormi** — mazmun bo'yicha tekshir:
  `git fetch origin && git show origin/main:index.html | grep -n '<yangi qator>'`
  (Ibrohim faylni veb orqali yuklashi mumkin — hash'ga tayanma). Yo'q bo'lsa — shuni ayt.
- avvalgi natijani **himoya qilma**
- ustiga darhol ikkinchi fix **yozma**
- nima **so'ralganini** qayta o'qi, nima **yozilganini** qayta o'qi, ikkisining **farqini ayt**
- keyin bitta aniq tuzatish taklif qil va **to'xta**

QR haqida «ishlamayapti» desa — avval login qilinmagan brauzerda tekshirilganmi, so'ra
(ochiq sahifa faqat login'siz ko'rinadi).

Tekshirilmagan fix ustiga tekshirilmagan fix qo'yish — kod izlanmaydigan bo'lib qolishining yo'li.

### Trigger iboralar

| Ibrohim yozsa | Javob |
|---|---|
| `taxmin?` / `3 savol` | Darhol TAXMIN BLOKI, boshqa hamma narsadan oldin |
| `faqat shuni qil` | Aynan qamrov, nol qo'shimcha |
| `nima o'zgardi?` | Haqiqiy qator raqamlari bilan TEKSHIRUV |
| `KOD YOZMA` | Faqat tahlil yoki mockup. Hech bir faylni o'zgartirma |
| `mockup qil` | HOZIRGI vs TAKLIF, Artifact. Kod yo'q |
| `chigallashib ketdi` | To'xta. `git diff origin/main` bo'yicha har o'zgarishni sanab, qaysilari so'ralmaganini ayt |

---

## 8. GIT

**Push faqat Ibrohim aytganda** (Ibrohim, 2026-10-08: *«Tilla kabi: faqat aytganda»*).

- Kod yozgandan keyin faqat commit — **aniq yo'llar** bilan:
  ```bash
  git status --short            # ro'yxatda faqat sen o'zgartirgan fayllar
  git add index.html DAVOM.md   # faqat haqiqatda o'zgarganlari
  git commit -m "vN — <qisqa mazmun>"
  ```
  `git add -A` / `git add .` **ishlatilmaydi** — `.gitignore` yo'q, sinov qoldig'i
  (`__pycache__/`, skrinshot, html nusxa) public repoga tushib qoladi.
- Ish `claude/<mavzu>` branch'ida. Bulutda push qilinmagan ish konteyner bilan yo'qoladi —
  shuning uchun har o'zgarish oxirida so'ra (§0.1, 2-band).
- `"push qil"` = ish branch'ini push qilish: `git push -u origin claude/<mavzu>` — branch nomini
  doim **aniq yoz** (seans branch'ining upstream'i `main` bo'lishi mumkin).
- `"prodga chiqar"` / `"main'ga qo'sh"` = `main`ga merge = **Vercel darhol deploy**. Faqat shu
  aniq so'zlardan keyin, TEKSHIRUV va JSX sinov OK bo'lsa.
- **Hech qachon:** `--force`, `main` tarixini qayta yozish, so'ralmagan merge.
- **Bitta o'zgarish — bitta commit.** Shunda `git show <hash>` o'sha o'zgarishning hamma qatorini
  ko'rsatadi, `git revert <hash>` bilan alohida qaytariladi.
- Vaqtinchalik fayllar (Babel, sinov nusxalari, skrinshot, PDF) **faqat repo tashqarisida**
  (`/tmp`, scratchpad). Python sinovlari `-B` yoki `PYTHONPYCACHEPREFIX` bilan.

---

## 9. SEANS OXIRIDA

1. `CHANGELOG.md` ga yozuv qo'sh (tepaga).
2. **`DAVOM.md` ni yangila** — nima qilindi, nima qoldi (⏳ shabloni), javobsiz savollar,
   Artifact havolalari, `main = <hash>`, ish branch @ hash, push holati.
3. Commit — aniq yo'llar bilan.
4. Ibrohimga oxirgi xabar: branch, push holati (push qilinmagan bo'lsa — «push qilaymi?»),
   `main`ga merge qilinmagan branchlar. `main`ga (prodga) hech narsa o'z-o'zidan chiqmaganini ayt.

---

## 10. KODDAGI TASDIQLANGAN FAKTLAR (`main` @ e0323b8, 2026-10-08)

Grep bilan tekshirilgan — mantiqni noldan qayta tahlil qilib vaqt yo'qotma. Lekin **qator
raqamlari siljiydi** (`~` = taxminiy): tahrirdan oldin `grep -n` bilan qayta top. Fakt kodga
to'g'ri kelmasa — **kod haqiqat**, bu bo'limni o'sha commitda yangila.

### Firestore kolleksiyalari (bazada `snake_case` → holatda `camelCase`, `loadAll` ~447–453)

| Kolleksiya | Maydonlar | Xarita |
|---|---|---|
| `products` | id, name, sku, category, dimensions, cost, price, markup, cost_items[{id,name,amount}], price_incomplete, image (base64 JPEG), created_at | cost_items→costItems, price_incomplete→priceIncomplete |
| `units` | id, unit_id, product_id, location (`"warehouse"` / store.id), status (`"available"`/`"sold"`), added_at, sent_at | unitId, productId, addedAt, sentAt |
| `stores` | id, name, address, manager, phone, created_at | — |
| `sales` | id, unit_ids (unitId MATNLARI), store_id, product_id, customer_id, customer_name, qty, price (chegirmadan keyin 1 dona), cost (sotuv paytidagi), total_amount, paid, pay_date, pay_method, debt_due, partial_payments[{id,amount,method,date}], date, created_at | unitIds, storeId, productId, customerId, customerName, totalAmount, payDate, payMethod, partialPayments. **`debt_due` xaritalanmaydi** |
| `orders` | id, order_id (`ZK-0001`), store_id, product_id, qty, note, deadline, price, prepaid, status (pending/working/ready/delivered), status_history[{status,time}], created_at | orderId, storeId, productId, statusHistory |
| `customers` | id, name, phone, created_at | — |
| `activity` | id, action, details, time (foydalanuvchi yozilmaydi) | — |
| `users` | id, username, password, role (superadmin/admin/moder/ombor). Ilovada foydalanuvchi boshqaruvi YO'Q | — |

### Har amal qayerga yozadi

| Amal | Funksiya | Yozuv |
|---|---|---|
| Mahsulot qo'shish/tahrir | `ProductModal` → `save` | `products` upsert; yangi + boshlang'ich son → `units` insert |
| Omborga qo'shish | `AddStockModal` → `add` | `units` insert (joy do'kon bo'lsa `sent_at` ham) |
| Vitrinaga jo'natish | `TransferModal` → `send` | `verifyUnitsUnchanged` → `units` upsert (location, sent_at) |
| Sotuv | `SellModal` → `sell` | `units` status="sold" → yangi mijoz `customers` → `sales` insert → `activity`. **Tranzaksiya emas** |
| To'lov | `PayModal` → `conf` | `sales` upsert: butun `partial_payments` massivi qayta yoziladi |
| Vitrinadan qaytarish | `ReturnModal` → `ret` | `units` location="warehouse". Sotuvni QAYTARISH funksiyasi yo'q |
| Zakaz qo'shish / tahrir | `OrderModal` → `save` | `orders` insert / upsert (tahrirda `status_history` O'ZGARMAYDI) |
| Zakaz statusi | `OrdersPage` select | `orders` update: status + `status_history` |
| Do'kon qo'shish/tahrir/o'chirish | `StoreModal`, `StoresPage` | `stores`; o'chirishda available unitlar omborga |
| Mahsulot o'chirish | `WarehousePage` | product_id bo'yicha `units` delete (SOTILGANLARI HAM) → `products` delete |
| Backup tiklash | `importBackup` | 6 kolleksiyaga upsert (`activity`, `users` eksportga kirmaydi) |
| Har amal | `log` | `activity` insert |

### Tuzoqlar (bilmasang xato qilasan)

- **`db` o'rami Supabase EMAS.** Faqat: `select, eq, in, order, limit, single, insert, upsert,
  update, delete`. Boshqasi (`neq`, `gt`, `or`, `range`, `maybeSingle`…) → `is not a function`.
  - `then` hech narsa qaytarmaydi → `.then(...).catch(...)` zanjiri **TypeError**. Yangi kodda
    FAQAT `await db...`.
  - Filtr serverda emas: `select/update/delete` butun kolleksiyani o'qib, brauzerda filtrlaydi;
    `limit` ham yuklangandan keyin.
  - **Filtrsiz `update()` / `delete()` BUTUN prod kolleksiyani o'zgartiradi/o'chiradi.** Har
    birida `.eq("id", …)` / `.in("id", …)` shart, qiymat `undefined` bo'lmasin.
  - `.insert(x).select()` / `.upsert(x).select()` **hech narsa yozmaydi** (op `select` ga qaytadi).
  - `insert` hujjatni to'liq ustidan yozadi, `upsert` merge qiladi.
  - Xato otilmaydi: `alert` + `{error}` qaytadi. Yangi yozuv kodi `TransferModal` naqshida:
    `const { error } = await db…; if (error) { setSaving(false); return; }`.
- **Ikki nom, biri eskiradi.** `loadAll` holatga `snake_case` ni ham, `camelCase` ni ham qo'yadi;
  yozuvdan keyingi `setX` faqat `camelCase` ni yangilaydi. `{ ...u, … }` spread bilan yozadigan
  joy (sotuv, qaytarish, do'kon o'chirish, zakaz tahriri) eski `snake_case` ni bazaga qaytarib
  yozishi mumkin. `exportBackup` bazani emas, HOLATNI eksport qiladi. Holatdan faqat `camelCase`
  o'qi (xaritalanmaganlar: `debt_due`, `created_at`).
- **Yangi maydon:** bazaga `snake_case`, `loadAll` xaritasiga `camelCase` + standart qiymat
  (`x.cost_items || []` kabi — eski hujjatlarda maydon yo'q, migratsiya yo'q), keyin yozuvdan
  keyingi qo'lda xaritalarning HAMMASI (~9 joy, bir-biridan farq qiladi).
- **`App` hook'lari faqat erta `return` lardan YUQORIDA** (`if (!user)` ~852, `if (loading)`
  ~901; oxirgi hook ~565). Pastroqqa qo'shilgan hook → oq ekran.
- **Sahifa/modal komponentlari `App` ichida** — har `App` renderida qayta yaratiladi, ichki holat
  yo'qoladi (internet uzilib-ulanishi, `setProducts`, `loadAll` ham `App` ni qayta chizadi).
  Sahifalar uchun `Screen` tuzatishi `claude/ombor-joyida-qolish` da, `main`da yo'q.
- **Real-time EMAS, telefonlar ko'p.** `onSnapshot` yo'q; har yozuv shu telefondagi eski
  holatdan hisoblanadi. Ikki telefon bir sotuvga to'lov olsa — keyingisi birinchisini o'chiradi.
  Unit ID va `ZK-` raqami lokal sanoqdan — takrorlanishi mumkin. `verifyUnitsUnchanged` faqat
  jo'natish/sotuv/qaytarishda va faqat location/status ni tekshiradi.
- **Sana UTC'da:** `today()`/`now()`/oy kaliti `toISOString()` dan. Toshkentda 00:00–04:59
  oralig'ida KECHAGI sana yoziladi. So'ralmasa tuzatilmaydi — taxmin blokida ayt.
- **QR:** manzil chop etish paytidagi `window.location.origin` dan olinadi — yorliq faqat
  `https://kabir-erp.vercel.app` dan chop etiladi (lokal/preview'dan chop etilgan QR ishlamaydi).
  Ochiq sahifa faqat login'siz ko'rinadi; mijoz telefoniga BUTUN `products` keladi (tannarx bilan).
- **PDF kontrakti jim buziladi:** noma'lum `type` → jimgina umumiy hisobot; yo'q kalit → bo'sh
  katak/0. Kalit o'zgarishi ikkala faylda bitta commitda. `money()` butun songa yaxlitlaydi va
  `$` qo'ymaydi (ekrandagi `fmt` dan farqli). `p()` matnni ReportLab markup sifatida o'qiydi —
  nomda `<i>`, `<br>` kabi yopilmagan teg bo'lsa butun PDF 500 xato (`&`, `<2m>` zararsiz).
- **Rollar uch joyda:** `canSee` (faqat `cost`/`price`/`profit` bilan chaqiriladi —
  `report`/`debt`/`users` o'lik), `navItems`, to'g'ridan `user?.role ===`. `renderPage` rolni
  tekshirmaydi; `kabir_tab` chiqishda tozalanmaydi. **Bu xavfsizlik emas** — `loadAll` har rolga
  butun bazani yuklaydi, Firebase Auth yo'q, rol `localStorage` dan. Haqiqiy himoya (Auth +
  Firestore qoidalari) — katta qaror, Ibrohimdan.
- **Login/parol:** `DEFAULT_USERS` faqat bazada YO'Q username'ni qo'shadi — koddagi parolni
  o'zgartirish bazaga ta'sir qilmaydi (yangi parol esa public repoga chiqadi); standart
  foydalanuvchi bazadan o'chirilsa, keyingi login urinishida qaytib keladi. Kirgan sessiya
  qayta tekshirilmaydi. «Parolni o'zgartir» desa — kod yozishdan oldin shularni ayt.
- **Vercel:** `vercel.json` yo'q — `api/` ichidagi har fayl ochiq endpoint bo'ladi (sinov
  skripti `api/` ga QO'YILMAYDI). React `@18`, Babel va `reportlab` versiyasiz — «hech narsa
  o'zgartirmadik, oq ekran / PDF xato» desa birinchi gumon shular.

### ⚠️ OCHIQ MUAMMOLAR (tasdiqlangan, tuzatilmagan, qaror Ibrohimdan)

So'ralmasa tuzatma. Boshqa ish shu joylarga tegsa — avval ayt.

1. **QR havola ilovani yiqitadi.** `#p=SKU` effekti `.then().catch()` zanjiri bilan
   (~386–388) → TypeError, ErrorBoundary yo'q. Login qilingan xodimda ham.
2. `fsGetAll` har so'rovda butun kolleksiyani o'qiydi; `activity` hech qachon tozalanmaydi.
3. Standart loginlar o'z-o'zidan qayta yoziladi (~131–139).
4. Unit ID soni bo'yicha; SKU noyobligi tekshirilmaydi.
5. `ZK-` raqami `orders.length + 1` dan — o'chirishdan keyin takrorlanadi.
6. `OrderModal` tahririda status o'zgarsa `status_history` yozilmaydi → PDF «Bajarildi» bo'sh.
7. `pdf.py` `STATUS_STYLE` / `ACTION_COLOR` kalitlari ilova matniga mos emas → kulrang.
8. `pdf.py` faqat Helvetica — kirill va `ʻ` ■ bo'lib chiqadi.
9. DB xatosi faqat `TransferModal` da tekshiriladi — boshqa joylarda ekran va baza ajraladi.
10. `pdfStore` `PayModal` orqali yopilgan sotuvni kassada ikki marta sanaydi; `click`/
    `installment` (qisman to'lovda `transfer` ham) xom kalit bo'lib chiqadi.
11. Mahsulot o'chirilsa sotilgan unitlar ham o'chadi → `sales` yetim.
12. `pdfHome` (location, amount), `pdfDebts` (closed), `pdfReport` (loss) qattiq bo'sh/0.
13. Moder `HomePage` va (`kabir_tab` orqali) `ReportPage` da foydani ko'radi; ombor kartochkasida
    narx rol tekshiruvisiz chiqadi.

### O'lik kod (chaqirilmaydi / ishlatilmaydi)

`dbSave`, `dbDelete`, `dbDeleteMany` (~477–494); `syncing` (shu sababli doim `false`);
Quagga `<script>` (~24); asosiy sahifadagi JsBarcode `<script>` (~23 — chop iframe o'zinikini
yuklaydi). O'chirish faqat alohida so'rov bilan.

### Muhim funksiyalar

| Funksiya | Qator | Vazifa |
|---|---|---|
| `firebaseConfig` / `fsdb` | ~100–112 | Firebase (qiymatni KO'CHIRMA) |
| `DEFAULT_USERS` | ~119–124 | Standart loginlar (qiymatni KO'CHIRMA) |
| `fsGetAll` / `db` | ~126 / ~144–220 | Butun kolleksiya o'qish / Supabase-uslub o'ram |
| `uid`, `today`, `now`, `fmt`, `fmtK`, `pad4`, `dateStr` | ~225–239 | Yordamchilar |
| `CATEGORIES`, `PAYMENT_INFO`, `ORDER_STATUS` | ~241–254 | Konstantalar |
| `App` | ~301–2949 | Butun ilova |
| `publicSku` + effekt + render | ~322 / ~384 / ~854 | QR ochiq sahifa |
| `exportBackup` / `importBackup` | ~343 / ~353 | JSON backup |
| `doLogin` / `canSee` | ~391 / ~405 | Login / rol |
| `loadAll` / `log` | ~435 / ~497 | Yuklash+xarita / `activity` |
| `verifyUnitsUnchanged`, `generateUnitId`, `getWhUnits`, `getStoreUnits` | ~510–539 | Unit |
| `stats` | ~541 | Umumiy ko'rsatkichlar |
| `openReportPdf`, `pdfHome`…`pdfReport` | ~567–684 | PDF ma'lumoti → `/api/pdf.py` |
| `buildYorliqHtml` / `buildGarantiyaHtml` | ~689 / ~751 | Yorliq 80×100, garantiya 80×150 mm |
| `ProductModal` … `OrderModal` | ~916–1778 | Modallar |
| `HomePage` … `ReportPage` | ~1783–2737 | Sahifalar |
| `renderPage` / `navItems` | ~2739 / ~2751 | tab → sahifa / rol menyusi |

`api/pdf.py`: `money` ~59, `p` ~66, `draw_chrome` ~193, `ACTION_COLOR` ~242, `build_*` ~245–399,
`STATUS_STYLE` ~339, `BUILDERS` ~435, `build_pdf` ~445, `handler` ~473 (CORS `*`).

---

## 11. FAYLLAR

```
index.html        ~2 960 qator (~195 KB, ~49k token) — butun ilova (React 18 UMD + Babel,
                  bitta <script type="text/babel">, Firebase Firestore compat 10.14.1)
api/pdf.py        PDF generator (Vercel Python funksiyasi, ReportLab)
requirements.txt  reportlab (versiyasiz)
CLAUDE.md         shu fayl — qoidalar
DAVOM.md          hozirgi holat + keyingi vazifa (har seans boshida o'qiladi)
CHANGELOG.md      versiya arxivi (YOZASAN, O'QIMAYSAN)
.vercelignore     *.md, mockups/, __pycache__/ ni saytdan yashiradi
                  (⚠ nomi NUQTA bilan — nuqtasiz bo'lsa Vercel o'qimaydi)
```

Kabir'da **YO'Q** (Tilla'da bor — ko'r-ko'rona ko'chirma): `vercel.json`, `.gitignore`,
`pos.html`, `hisob.js`, `print_server.py`, `mockups/`, `POS_VER`, `TEST_` kolleksiyalar, hamid.
Yangi fayl qo'shish (ayniqsa `vercel.json`, `api/` ichiga) deploy'ga ta'sir qiladi — faqat
Ibrohim ruxsati bilan.

Repo PUBLIC: `.md` fayllar GitHub'da baribir ko'rinadi — ularga ham parol, kalit, mijoz
ma'lumoti yozilmaydi.
