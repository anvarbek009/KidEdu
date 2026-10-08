# 🦊 KidEdu - Bolalar uchun Quvnoq Ta'lim Olami (MVP)

**KidEdu** — 5–10 yoshli bolalar uchun mo'ljallangan, interaktiv ertaknamo o'yin olami shaklidagi ta'lim platformasi.

---

## 🌟 Asosiy Imkoniyatlar & Xususiyatlar

### 🎨 1. Noyob Dizayn (Storybook / Game World)
- **Ertaknamo dizayn tizimi**: Iliq qog'oz teksturasi (`#FDFBF7`, `#FAF5EC`), tabiiy gilli 3D tugmalar (`clay-btn`), to'lqinsimon chiziqlar va yumshoq tabiiy ranglar (terrakota, adaçayı yashili, quyoshli sariq, daryo ko'ki).
- **Interaktiv Maskot "Doni"**: O'zbek tilida quvnoq gapiruvchi, his-tuyg'ularini namoyon qiluvchi (xursand, o'ychan, g'olib) va kiyimlarini almashtirish mumkin bo'lgan jonli hamroh.
- **Sarguzasht Xaritasi**: Bolalar uchun zerikarli dashboard o'rniga sehrli orollar (Alifbo O'rmoni, Raqamlar Qasri, Sehrli Kitobxonlik, Yutuqlar Xazinasi va Kiyimlar Do'koni).

---

### 🔤 2. O'zbek Alifbosi & Savodxonlik (Alifbo O'rmoni)
- **29 ta O'zbek lotin harfi** (jumladan `Oʻ`, `Gʻ`, `Sh`, `Ch`, `Ng`).
- **Ovozli talaffuz**: Web Speech API va Web Audio yordamida harf tovushlari va so'zlarni o'zbekcha o'qish.
- **Interaktiv Harf Chizish / Yozish (Letter Tracing Canvas)**: Bolalar barmoq yoki sichqoncha bilan nuqtali andoza ustidan harflarni yozadi, xatolar tozalanadi va yulduzlar bilan taqdirlanadi.
- **Topqir Quloq (Listening Quiz)**: Eshitilgan tovush va harfga mos rasmni topish viktorinasi.
- **So'z Terish Konstruktori (Spelling Builder)**: Harf bloklarini to'g'ri tartibda terish orqali o'zbekcha so'zlarni yasash (Olma, Baliq, Gul, Non, Quyosh).

---

### 🔢 3. Matematika Sarguzashti (Raqamlar Qasri)
- **Yoshga moslashtirilgan o'quv dasturi**:
  - **5–6 yosh**: 1–10 gacha meva va yulduzlarni barmoq bilan sanash, to'plamlarni taqqoslash ("Qaysi biri ko'p?"), oddiy ko'rgazmali qo'shish.
  - **7–8 yosh**: 1–20 va 1–100 oralig'ida tezkor qo'shish/ayirish, sehrli bo'sh kataklar (`8 + ? = 15`), sonlar ketma-ketligi (`2, 4, 6, ?`).
  - **9–10 yosh**: 2 dan 9 gacha ko'paytirish jadvali, bo'lish asoslari va o'zbekcha mantiqiy matnli masalalar.
- **Interaktiv sanash maydoni**: Bolalar ekrandagi har bir mevani bosganda tovush chiqarib rangini o'zgartiradi.
- **Combo streak & Fanfare**: Ketma-ket to'g'ri javoblar uchun olovli multiplikator va konfetti mushakbozligi.

---

### 📖 4. Sehrli Kitobxonlik (Ertaklar)
- Bolalar uchun qiziqarli o'zbekcha ertaklar ("Quvnoq Ayiqcha va Asal", "Quyonvoy va Sehrli Sabzi", "Koinotga Uchgan Qushcha").
- Matndagi so'zlarni alohida bosib talaffuzini eshitish imkoniyati.
- Ertak so'ngida tushunish darajasini aniqlovchi interaktiv savollar.

---

### 🛡️ 5. Ota-Ona Nazorati & Himoya Qulfi (Parent Gate)
- **Bolalardan himoyalangan qulf**: Matematik misol (`7 × 8 = ?`) yoki 4 xonali PIN-kod (Standart demo PIN: `1234`) orqali kirish.
- **Batafsil Tahlil (Analytics)**: Umumiy o'rganish daqiqalari, fanlar bo'yicha aniqlik foizi (Matematika % vs Alifbo %), so'nggi darslar jurnali.
- **Bolalar Profillarini Boshqarish**: Yangi bola qo'shish, yosh guruhini o'zgartirish, kunlik ekran vaqti chegarasini belgilash (15, 30, 45, 60 daqiqa yoki cheksiz).
- **Zaxira & Eksport**: Barcha natijalarni JSON fayl ko'rinishida yuklab olish.

---

### 🏆 6. Geymifikatsiya & Do'kon
- **XP, Darajalar & Olovli Kunlik Streak**: Har bir to'g'ri javob uchun XP va tangalar.
- **10+ Maxsus Yutuq Medallari** (Birinchi Qadam, Hisobdon Mittivoy, Alifbo Kashfiyotchisi, Olovli Sayohatchi va h.k.).
- **Doni Kiyimlar Do'koni**: Yig'ilgan yulduzli tangalarga Doni maskotiga somon shlyapa, sehrgar qalpog'i, dono ko'zoynak, sumka va qahramon plashini sotib olish va kiyintirish!

---

### 🖥️ 7. To'liq Ekran "O'rganish Rejimi" & Moslashuvchanlik
- Brauzerning Fullscreen API integratsiyasi orqali chalg'ituvchi tugmalarsiz maxsus o'rganish muhiti.
- Mobil qurilmalarda katta sensorli tugmalar, planshetlarda moslashuvchan grid va noutbuk/kompyuterlarda to'liq ekran keng formatli tartib.

---

## 🚀 Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Dasturchi serverini ishga tushirish
npm run dev

# 3. Brauzerda ochish:
# http://localhost:5173
```
