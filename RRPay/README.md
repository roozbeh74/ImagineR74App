# RRPay - پلتفرم فاست و کیف پول ارز دیجیتال

<div dir="rtl">

## 📋 فهرست مطالب

- [معرفی](#معرفی)
- [ویژگی‌ها](#ویژگی‌ها)
- [ساختار پروژه](#ساختار-پروژه)
- [پیش‌نیازها](#پیش‌نیازها)
- [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
- [تنظیمات محیطی](#تنظیمات-محیطی)
- [API Documentation](#api-documentation)
- [امنیت](#امنیت)
- [توسعه](#توسعه)
- [مجوز](#مجوز)

---

## 🎯 معرفی

RRPay یک پلتفرم مدرن و امن برای فاست (دریافت رایگان) ارزهای دیجیتال است که با استفاده از تکنولوژی‌های روز دنیا توسعه یافته است. این پلتفرم به کاربران امکان می‌دهد تا به صورت رایگان بیت‌کوین، اتریوم، تتر و دوج‌کوین دریافت کنند و همچنین امکان برداشت ارزهای دیجیتال را فراهم می‌کند.

### تکنولوژی‌های استفاده شده

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Winston Logger

**Frontend:**
- HTML5, CSS3, JavaScript
- طراحی واکنش‌گرا (Responsive)
- انیمیشن‌های مدرن

**Blockchain Integration:**
- Bitcoin (BlockCypher API)
- Ethereum (Etherscan/Infura API)
- USDT (ERC20/TRC20)
- Dogecoin (SoChain API)

---

## ✨ ویژگی‌ها

### 🔐 امنیت
- احراز هویت با JWT
- رمزنگاری پسورد با bcrypt
- محافظت در برابر حملات XSS و CSRF
- Rate Limiting برای جلوگیری از سوءاستفاده
- لاگ‌گیری کامل فعالیت‌ها

### 💰 فاست ارز دیجیتال
- دریافت رایگان BTC, ETH, USDT, DOGE
- تعیین زمان انتظار بین هر بار دریافت
- محدودیت روزانه برداشت
- تاریخچه کامل دریافت‌ها

### 💸 برداشت
- درخواست برداشت به کیف پول شخصی
- پشتیبانی از چندین ارز دیجیتال
- تایید آدرس کیف پول
- پیگیری وضعیت برداشت

### 👤 مدیریت کاربران
- ثبت‌نام و ورود امن
- پروفایل کاربری
- مشاهده موجودی‌ها
- تاریخچه تراکنش‌ها

### 🛡️ پنل ادمین
- تایید/رد برداشت‌ها
- مدیریت کاربران
- تنظیمات فاست
- گزارش‌گیری

---

## 📁 ساختار پروژه

```
RRPay/
├── backend/
│   ├── config/
│   │   └── database.js          # تنظیمات اتصال به دیتابیس
│   ├── controllers/
│   │   ├── authController.js    # کنترلر احراز هویت
│   │   ├── faucetController.js  # کنترلر فاست
│   │   └── withdrawalController.js # کنترلر برداشت
│   ├── middleware/
│   │   └── auth.js              # میدل‌ورهای احراز هویت
│   ├── models/
│   │   ├── User.js              # مدل کاربر
│   │   ├── Transaction.js       # مدل تراکنش
│   │   └── FaucetConfig.js      # مدل تنظیمات فاست
│   ├── routes/
│   │   ├── authRoutes.js        # مسیرهای احراز هویت
│   │   ├── faucetRoutes.js      # مسیرهای فاست
│   │   └── withdrawalRoutes.js  # مسیرهای برداشت
│   ├── services/
│   │   └── blockchainService.js # سرویس بلاکچین
│   ├── utils/
│   │   └── logger.js            # تنظیمات لاگ
│   ├── logs/                    # فایل‌های لاگ
│   ├── .env.example             # نمونه فایل محیطی
│   ├── package.json
│   └── server.js                # نقطه شروع برنامه
├── frontend/
│   ├── index.html               # صفحه اصلی
│   ├── style.css                # استایل‌ها
│   └── app.js                   # منطق جاوااسکریپت
└── README.md                    # همین فایل
```

---

## 🚀 پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب شده‌اند:

- **Node.js** (نسخه 16 یا بالاتر)
- **MongoDB** (نسخه 4.4 یا بالاتر)
- **npm** یا **yarn**

### نصب Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18

# Windows
# دانلود از https://nodejs.org/
```

### نصب MongoDB

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# macOS
brew tap mongodb/brew
brew install mongodb-community@6.0

# یا استفاده از MongoDB Atlas (Cloud)
# https://www.mongodb.com/cloud/atlas
```

---

## 📥 نصب و راه‌اندازی

### 1. کلون کردن پروژه

```bash
cd /workspace/RRPay
```

### 2. نصب وابستگی‌های Backend

```bash
cd backend
npm install
```

### 3. تنظیم فایل محیطی

```bash
cp .env.example .env
```

سپس فایل `.env` را با مقادیر مناسب ویرایش کنید.

### 4. اجرای MongoDB

```bash
# اگر MongoDB را محلی نصب کرده‌اید
sudo systemctl start mongod

# یا استفاده از Docker
docker run -d -p 27017:27017 --name rrpay-mongo mongo:6.0
```

### 5. اجرای سرور

```bash
# حالت توسعه (با auto-reload)
npm run dev

# حالت تولید
npm start
```

سرور روی `http://localhost:3000` اجرا می‌شود.

### 6. باز کردن Frontend

فایل `frontend/index.html` را در مرورگر باز کنید یا از آدرس `http://localhost:3000` (در حالت تولید) استفاده کنید.

---

## ⚙️ تنظیمات محیطی

فایل `.env` باید شامل متغیرهای زیر باشد:

### تنظیمات سرور
```env
PORT=3000
NODE_ENV=development
```

### تنظیمات دیتابیس
```env
MONGODB_URI=mongodb://localhost:27017/rrpay
# یا برای MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rrpay
```

### تنظیمات JWT
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### تنظیمات امنیتی
```env
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### تنظیمات فاست
```env
FAUCET_CLAIM_INTERVAL_MINUTES=60
MIN_WITHDRAWAL_AMOUNT=0.00001
```

### کلیدهای API بلاکچین
```env
# Bitcoin
BLOCKCYPHER_API_KEY=your-blockcypher-api-key

# Ethereum
ETHERSCAN_API_KEY=your-etherscan-api-key
INFURA_PROJECT_ID=your-infura-project-id
INFURA_PROJECT_SECRET=your-infura-project-secret

# USDT (TRON)
TRONGRID_API_KEY=your-trongrid-api-key

# Dogecoin
SOCHAIN_API_KEY=your-sochain-api-key
```

### آدرس کیف پول‌ها
```env
BTC_WALLET_ADDRESS=your-bitcoin-wallet-address
ETH_WALLET_ADDRESS=your-ethereum-wallet-address
USDT_WALLET_ADDRESS=your-usdt-wallet-address
DOGE_WALLET_ADDRESS=your-dogecoin-wallet-address
```

### تنظیمات ایمیل
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### تنظیمات Frontend
```env
FRONTEND_URL=http://localhost:8080
LOG_LEVEL=info
```

---

## 📚 API Documentation

### احراز هویت

#### ثبت‌نام کاربر جدید
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### ورود
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### دریافت اطلاعات کاربر جاری
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### فاست

#### دریافت تنظیمات فاست
```http
GET /api/faucet
```

#### دریافت از فاست
```http
POST /api/faucet/claim
Authorization: Bearer <token>
Content-Type: application/json

{
  "currency": "BTC"
}
```

#### تاریخچه دریافت‌ها
```http
GET /api/faucet/history?currency=BTC&page=1&limit=10
Authorization: Bearer <token>
```

#### زمان بعدی دریافت
```http
GET /api/faucet/next-claim/BTC
Authorization: Bearer <token>
```

### برداشت

#### درخواست برداشت
```http
POST /api/withdrawal
Authorization: Bearer <token>
Content-Type: application/json

{
  "currency": "BTC",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "amount": 0.001
}
```

#### تاریخچه برداشت‌ها
```http
GET /api/withdrawal/history?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### پردازش برداشت (ادمین)
```http
PUT /api/withdrawal/process/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "action": "approve",
  "txHash": "0x..."
}
```

---

## 🔒 امنیت

### بهترین روش‌های امنیتی پیاده‌سازی شده

1. **رمزنگاری پسورد**: استفاده از bcrypt با 12 دور
2. **JWT Authentication**: توکن‌های امن با تاریخ انقضا
3. **Rate Limiting**: محدودیت تعداد درخواست‌ها
4. **Helmet.js**: هدرهای امنیتی HTTP
5. **CORS**: کنترل دسترسی Cross-Origin
6. **Input Validation**: اعتبارسنجی ورودی‌ها
7. **Logging**: ثبت تمام فعالیت‌های مهم

### نکات امنیتی مهم

- ⚠️ **هرگز** فایل `.env` را در Git کامیت نکنید
- ⚠️ کلیدهای API و Private Key‌ها را محرمانه نگه دارید
- ⚠️ در تولید از HTTPS استفاده کنید
- ⚠️ به طور منظم وابستگی‌ها را آپدیت کنید
- ⚠️ از کیف پول‌های سخت‌افزاری برای ذخیره ارزها استفاده کنید

---

## 🛠️ توسعه

### افزودن ارز جدید

1. اضافه کردن به مدل `FaucetConfig`
2. اضافه کردن endpointهای API در `blockchainService.js`
3. بروزرسانی Frontend

### تست API

```bash
# نصب Jest برای تست
npm install --save-dev jest

# اجرای تست‌ها
npm test
```

### دیباگ کردن

```bash
# استفاده از nodemon با دیباگ
nodemon --inspect server.js
```

سپس در Chrome به آدرس `chrome://inspect` بروید.

---

## 📝 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

---

## 🤝 مشارکت

خوشحال می‌شویم که در توسعه این پروژه مشارکت کنید!

1. Fork پروژه
2. ایجاد برنچ جدید (`git checkout -b feature/AmazingFeature`)
3. کامیت تغییرات (`git commit -m 'Add some AmazingFeature'`)
4. Push به برنچ (`git push origin feature/AmazingFeature`)
5. ایجاد Pull Request

---

## 📞 پشتیبانی

برای گزارش مشکلات یا درخواست ویژگی‌های جدید، لطفاً از بخش Issues گیت‌هاب استفاده کنید.

---

<div align="center">

**ساخته شده با ❤️ توسط تیم RRPay**

</div>

</div>
