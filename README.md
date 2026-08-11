<h1 dir="rtl" align="center">رایحه — RAYEHEH</h1>

<p dir="rtl" align="center">خانهٔ عطر لوکس | فروشگاه آنلاین کامل عطر و ادکلن با پنل مدیریت</p>

<p dir="rtl" align="center">
  <b>فرانت‌اند:</b> React 18 + Tailwind CSS 3 (راست‌چین، کاملاً فارسی) &nbsp;•&nbsp;
  <b>بک‌اند:</b> Node.js + Express 4 + MongoDB (Mongoose 8) &nbsp;•&nbsp;
  <b>احراز هویت:</b> JWT در کوکی امن httpOnly
</p>

---

## 🧭 معرفی

**رایحه** یک فروشگاه اینترنتی کامل و حرفه‌ای عطر و ادکلن است — از ویترین فروشگاه تا پنل مدیریت — با هویت بصری اختصاصی لوکس فارسی: پالت «جوهر و کاغذ و زعفران»، فونت‌های گُلزار (تیتر) و وزیرمتن (متن)، مهر طلایی چرخان «ر» و بطری عطر SVG دست‌ساز که برای هر محصول با پالت رنگیِ خودش رندر می‌شود.

### امکانات فروشگاه (فرانت‌اند)

- 🏠 **صفحهٔ اصلی**: هیرو با بطری متحرک، نوار اعتماد، دسته‌بندی‌ها، پرفروش‌ترین‌ها، تازه‌ها، آمار برند، دیدگاه مشتریان و مجله
- 🛍️ **فروشگاه**: فیلتر دسته/جنسیت، قیمت، رایگان‌شدن ارسال، مرتب‌سازی و صفحه‌بندی
- 🧴 **صفحهٔ محصول**: اهرم بویایی (نت‌ها)، ماندگاری و پخش بو، قیمت با تخفیف، دیدگاه‌ها، محصولات مشابه
- 🛒 **سبد خرید**: کشوی کنار صفحه + صفحهٔ کامل با محاسبهٔ ارسال (تهران/شهرستان، ارسال رایگان بالای سقف)
- 💳 **تسویه‌حساب**: فرم گیرنده و آدرس، خلاصهٔ سفارش، پرداخت شبیه‌سازی‌شده
- 📦 **پیگیری سفارش**: ثبت سفارش + جستجوی سفارش با کد رهگیری
- 👤 **حساب کاربری**: ثبت‌نام/ورود، پروفایل، تغییر رمز، تاریخچهٔ سفارش‌ها
- ✍️ **مجلهٔ رایحه** (مقالات)، **سؤالات متداول**، **تماس با ما** (فرم با موضوع انتخابی)، **دربارهٔ ما**

### امکانات پنل مدیریت (`/admin`)

- 📊 **داشبورد**: درآمد کل، سفارش‌ها، محصولات، کاربران، خبرنامه‌ها، پیام‌های خوانده‌نشده، سفارش‌های اخیر، هشدار موجودی کم
- 🧪 **محصولات**: جدول جستجو/صفحه‌بندی، فرم کامل افزودن/ویرایش (نت‌ها، تخفیف، نشان‌ها، موجودی، نمایش/عدم نمایش)، حذف
- 📦 **سفارش‌ها**: تغییر وضعیت (در انتظار → پرداخت‌شده → در حال پردازش → ارسال‌شده → تحویل‌شده/لغو)، کد رهگیری
- 💬 **پیام‌های تماس** و 📧 **خبرنامه‌ها**: مشاهده و حذف
- 👥 **کاربران**: تغییر نقش (مدیر/مشتری) با محافظت از «آخرین مدیر»

### امنیت بک‌اند

- JWT در کوکی httpOnly (۷ روزه) + bcrypt برای رمزها
- محافظت rate-limit روی ورود/ثبت‌نام/ثبت سفارش/ارسال پیام
- هدرهای امنیتی helmet، CORS محدود به آدرس کلاینت، validation با express-validator
- **قفل اتمی موجودی** هنگام ثبت سفارش (الگوی `findOneAndUpdate` شرطی بدون نیاز به تراکنش) — جلوگیری از فروش بیش از موجودی
- پاکسازی خودکار قفل‌های منقضی، اطمینان از وجود دست‌کم یک مدیر

---

## 🗂️ ساختار پروژه

```
rayeheh/
├── client/                     # فرانت‌اند — React + Vite + Tailwind
│   └── src/
│       ├── components/         # بطری SVG، کارت محصول، هدر/فوتر، کشوی سبد، …
│       ├── context/            # AuthContext / CartContext / UiContext / SettingsContext
│       ├── pages/              # خانه، فروشگاه، محصول، سبد، تسویه، حساب، تماس، …
│       ├── pages/admin/        # داشبورد، محصولات، سفارش‌ها، پیام‌ها، خبرنامه‌ها، کاربران
│       ├── data/static.js      # متن‌های ثابت (مجله، سؤالات، دیدگاه‌ها، آمار)
│       └── lib/                # api.js (axios)، palette.js، utils.js
├── server/                     # بک‌اند — Express + Mongoose
│   ├── src/
│   │   ├── config/db.js        # اتصال MongoDB
│   │   ├── models/             # Product, Order, User, Review, Category, Subscriber, ContactMessage
│   │   ├── controllers/        # auth / product / category / order / misc / admin
│   │   ├── middlewares/        # auth (JWT)، rate-limit، validation، خطا
│   │   ├── routes/             # routes نسخه‌دار /api/v1
│   │   ├── seed/seed.js        # دادهٔ نمونه (۲۳ عطر، مدیر، کاربر آزمایشی، سفارش، دیدگاه)
│   │   └── server.js
│   └── .env.example            # الگوی تنظیمات سرور
└── package.json                # اسکریپت‌های مشترک (dev / seed / build / start)
```

> 💡 فقط چند فایل مهم اینجا آمده؛ برای جزئیات کامل، پوشه‌ها را باز کنید — هر فایل با کامنت فارسیِ مختصر توضیح داده شده.

---

## 🚀 راه‌اندازی

### پیش‌نیازها

- **Node.js 18+**
- **MongoDB** (مثل نسخهٔ Community 8.x)
- **npm**

### ۱) نصب وابستگی‌ها

```bash
npm install                 # ریشه — concurrently
npm install --prefix client
npm install --prefix server
```

### ۲) تنظیمات سرور

```bash
cp server/.env.example server/.env   # ویندوز: copy server\.env.example server\.env
```

سپس `JWT_SECRET` را به یک رشتهٔ بلند و تصادفی تغییر دهید. مقدارهای پیش‌فرض همان است که باید باشد (پورت ۵۰۰۱، MongoDB لوکال، آدرس کلاینت ۵۱۷۳). اگر مایل به ارسال ایمیل واقعی هستید، SMTP را در `.env` پر کنید؛ در غیر این صورت ایمیل‌ها به‌صورت dry-run در کنسول سرور چاپ می‌شوند.

### ۳) اجرای MongoDB

دیتابیس در `server/.mongo-data` نگهداری می‌شود:

```bash
# ویندوز — از پوشهٔ ریشهٔ پروژه:
mkdir -p server/.mongo-data
"/c/Program Files/MongoDB/Server/8.2/bin/mongod" --dbpath server/.mongo-data --port 27017
```

(یا نسخهٔ نصب‌شدهٔ خودتان را در همین مسیر قرار دهید.)

### ۴) بارگذاری دادهٔ نمونه

```bash
npm run seed
```

- ۲۳ عطر در ۴ دسته، ۸ دیدگاه، یک سفارش نمونه، ۲ مشترک، یک پیام تماس
- مدیر اصلی: `admin@rayeheh.com` / `Admin@123456`
- کاربر آزمایشی: `demo@rayeheh.com` / `demo1234`

> `npm run seed -- --fresh` همهٔ کالکشن‌ها را پاک می‌کند و از نو می‌سازد.

### ۵) اجرای برنامه

```bash
npm run dev        # هم‌زمان: سرور روی :5001 و کلاینت روی :5173
```

- 🌐 فروشگاه: http://localhost:5173
- 🛠️ پنل مدیریت: http://localhost:5173/admin (با حساب مدیر وارد شوید)

---

## 🔑 حساب‌ها

| نقش | ایمیل | رمز |
|---|---|---|
| مدیر | `admin@rayeheh.com` | `Admin@123456` |
| مشتری (آزمایشی) | `demo@rayeheh.com` | `demo1234` |

---

## 📡 خلاصهٔ API (پیشوند `/api`)

| دسته | مسیرها |
|---|---|
| محصولات | `GET /products` (فیلتر/مرتب/صفحه)، `GET /products/:id`، `GET /products/slug/:slug`، `GET /products/:id/reviews`، `POST /products/:id/reviews` (با ورود) |
| دسته‌ها | `GET /categories` |
| سفارش | `POST /orders`، `GET /orders/:ref` (پیگیری)، `GET /orders/mine` (با ورود) |
| حساب | `POST /auth/register`، `POST /auth/login`، `POST /auth/logout`، `GET /auth/me` |
| متفرقه | `POST /contact`، `POST /subscribe`، `GET /faqs`، `POST /verify/:ref` |
| مدیریت | `GET /admin/stats`، CRUD محصولات/سفارش‌ها/پیام‌ها/خبرنامه‌ها/کاربران — همه نیازمند ورود مدیر |

---

## 📝 نکات فنی

- **ترتیب اتمی سفارش بدون تراکنش**: چون mongod مستقل (بدون replica set) تراکنش ندارد، قفل گرفتن (`lockedAt`) و کسر موجودی در **یک** عملیاتِ اتمیِ `findOneAndUpdate` انجام می‌شود — دو سفارش هم‌زمان هرگز از موجودیِ مشترک عبور نمی‌کنند؛ در موفقیت، قفلِ همین درخواست آزاد می‌شود و در خطا، موجودی و قفل برگردانده می‌شوند.
- **پیت‌فال `strictQuery`**: فیلترهای ناشناخته در کوئری Mongoose بی‌صدا حذف می‌شوند — فیلترها را همیشه روی فیلدهای موجود بنویسید (مثل حذف نظراتِ یک محصول با `Review.deleteMany({ product: id })`، نه `Product.deleteMany({ product: id })`).
- **اعداد فارسی**: تمام قیمت‌ها و شمارنده‌ها با `toFa`/`Intl.NumberFormat('fa-IR')` به فارسی تبدیل می‌شوند.
- **محاسبهٔ ارسال**: تهران ۴۵٬۰۰۰ تومان (رایگان بالای ۲٬۰۰۰٬۰۰۰)؛ شهرستان ۶۵٬۰۰۰ تومان (رایگان بالای ۲٬۵۰۰٬۰۰۰).
- **دموی پرداخت**: در حالت توسعه، پرداخت شبیه‌سازی می‌شود و سفارش بلافاصله «پرداخت‌شده» ثبت می‌گردد.

---

## 🛠️ اسکریپت‌ها

| دستور | توضیح |
|---|---|
| `npm run dev` | اجرای هم‌زمان سرور و کلاینت (توسعه) |
| `npm run dev:server` | فقط سرور (nodemon، پورت ۵۰۰۱) |
| `npm run dev:client` | فقط کلاینت (Vite، پورت ۵۱۷۳) |
| `npm run seed` | بارگذاری دادهٔ نمونه |
| `npm run build` | ساخت نسخهٔ تولید کلاینت |
| `npm start` | اجرای سرور در حالت تولید |

---

## 🌍 English Summary

**RAYEHEH** is a complete Persian RTL luxury perfume e-commerce (React 18 + Tailwind 3 frontend, Express + MongoDB backend). Features: full storefront (home, filtered shop, product pages with scent pyramids, cart with shipping calculator, checkout, order tracking, auth, journal, FAQ, contact) and a full admin panel (dashboard with revenue stats, product/order/message/subscriber/user management). Authentication via httpOnly-cookie JWT; stock is decremented atomically on order placement; seeded with 23 perfumes, an admin and a demo account. Setup: `npm install`, copy `server/.env.example` to `server/.env`, start `mongod` on `server/.mongo-data`, `npm run seed`, then `npm run dev`.

---

<p dir="rtl" align="center"><b>رایحه — عطر فقط عطر نیست؛ امضای توست. ✨</b></p>
