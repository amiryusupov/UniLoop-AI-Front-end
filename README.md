## UniLoop AI

UniLoop AI talabalarning o‘qishi, dalillari va kasbiy rivojlanishini uzluksiz qo‘llab-quvvatlaydigan sun’iy intellektga tayyor ta’lim tizimidir.

### Texnologiyalar

- Next.js App Router, React va TypeScript
- Tailwind CSS 4 va shadcn/ui
- TanStack Query, Zod, React Hook Form va Zustand
- Recharts, Lucide React va date-fns

### Mahalliy ishga tushirish

Node.js LTS o‘rnatilgan bo‘lishi kerak.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) manzilini oching.

Sifat tekshiruvlari:

```bash
npm run lint
npm run validate:data
npx tsc --noEmit
npm run build
```

### Muhit o‘zgaruvchilari

| O‘zgaruvchi | Tavsif |
| --- | --- |
| `NEXT_PUBLIC_USE_MOCKS` | Mock rejimini yoqadi yoki o‘chiradi. |
| `NEXT_PUBLIC_MOCK_SCENARIO` | `populated`, `empty` yoki `error`; standart qiymat `populated`. |
| `NEXT_PUBLIC_API_URL` | Kelajakdagi NestJS backend manzili; standart qiymat `http://localhost:5001/api/v1`. |
| `NEXT_PUBLIC_STUDENT_SURVEY_URL` | Talabalar so‘rovnomasi manzili; hozircha bo‘sh bo‘lishi mumkin. |
| `NEXT_PUBLIC_PROFESSOR_SURVEY_URL` | Professor-o‘qituvchilar so‘rovnomasi manzili; hozircha bo‘sh bo‘lishi mumkin. |

### Loyihalash qoidalari

Kod identifikatorlari ingliz tilida, foydalanuvchiga ko‘rinadigan barcha matnlar esa markazlashtirilgan Uzbek Latin lokalizatsiyasida saqlanadi. Integratsiyalar mock-first tamoyiliga amal qiladi: UI backend ma’lumotlariga bog‘lanmasdan ishlaydi, keyingi bosqichlarda typed API qatlam orqali ulanadi.

### Hozirgi holat

Phase 1 dizayn, lokalizatsiya, muhit konfiguratsiyasi va providerlar asosini yaratdi. Phase 2 demo rollari, himoyalangan yo‘nalishlar, umumiy qobiq va mobil navigatsiyani qo‘shdi. Phase 3 typed domen modellari, tekshiriladigan DTOlar, HTTP/mock transportlar, izchil sintetik ma’lumotlar va Query/Mutation hooklarini qo‘shdi.

Joriy sahifalar hali ixcham boshlang‘ich ko‘rinishlardir. To‘liq dashboardlar, haqiqiy backend autentifikatsiyasi va AI funksiyalari keyingi bosqichlarga tegishli. Yangi data hooklari hali sahifalarga ulanmagan.

Backend bilan kelishiladigan yo‘nalish va DTOlar: [frontend API shartnomasi](docs/frontend-api-contract.md). Mock mutatsiyalar xotirada saqlanadi; sahifani to‘liq yangilash boshlang‘ich ma’lumotlarni tiklaydi. Tanlangan demo roli esa lokal xotirada saqlanadi.

Ma’lum sandbox Turbopack worker ruxsati muammosi yuz bersa, `npm run build -- --webpack` orqali ishlab chiqarish buildini tekshiring.

Keyingi rejalashtirilgan bosqich: talabalar uchun akademik ish jarayonlari.
# UniLoop-AI-Front-end
