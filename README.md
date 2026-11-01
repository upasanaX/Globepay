<div align="center">

# 🌐 GlobePay
### *Like Google Pay — Everywhere on Earth.*
**Scan & Pay Anywhere in the World with Instant Auto-Currency Exchange in 1 Tap.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Knex-003B57?logo=sqlite&logoColor=white)](https://knexjs.org/)
[![JWT Auth](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt-black?logo=jsonwebtokens)](https://jwt.io/)

---

[Key Features](#-key-features) • [How It Works](#-how-it-works) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Demo Account](#-demo-account) • [API Overview](#-api-overview)

---

</div>

## 💡 The Vision

Whenever you travel abroad or buy from foreign vendors, making a simple payment is broken:
- Banks charge **3% to 5% hidden foreign exchange markups**.
- Foreign QR payment systems (e.g. PayPay/LinePay in Japan, PromptPay in Thailand, UPI in India, SEPA in Europe) are walled off to tourists.
- Carrying cash is inconvenient and international card terminals frequently decline.

**GlobePay solves this with Google Pay simplicity on a global scale:**
Point your camera at **any merchant's QR code in any country**. GlobePay automatically detects the merchant, recognizes their local currency (e.g., ¥1,850 JPY in Tokyo or €24.50 EUR in Paris), auto-converts the required amount from your home currency wallet at live mid-market exchange rates, and settles the funds directly into their account in **1 Tap**.

```
  [ Your Phone (Any Country) ] 
               │ 
               ▼ (Camera Scan)
  [ Merchant QR Code in Tokyo / Paris / London / Dubai ]
               │
               ├── 1. Auto-Detects Merchant & Local Currency (¥1,850 JPY, €24.50 EUR)
               ├── 2. Auto-Calculates Real-Time FX from Home Balance (0% Foreign Markup)
               └── 3. 1-Tap Pay ──> Debits your wallet ──> Settles into their local account ⚡
```

---

## ⚡ Key Features

- **📷 Global 1-Tap Scan & Pay**:
  - Interactive camera viewfinder with multi-standard recognition.
  - Test presets for international merchants across **Tokyo 🇯🇵, Paris 🇫🇷, London 🇬🇧, and Dubai 🇦🇪**.
  - Dynamic currency detection and instant digital settlement receipts.
- **💱 Real-Time Multi-Currency Engine**:
  - Live mid-market exchange rates across USD, EUR, GBP, JPY, INR, AED, and more.
  - Zero foreign transaction fee spread (transparent 0% markup vs traditional banks).
  - Instant wallet-to-wallet currency exchange.
- **💼 Multi-Currency Digital Wallets**:
  - Hold, manage, and transact across multiple international balances simultaneously.
  - Real-time balance debits and atomic ledger settlement.
- **💳 Virtual Card Management**:
  - Instant virtual debit card creation.
  - 1-click Freeze / Unfreeze controls and configurable daily spending limits.
  - Masked card number display with clipboard copy support.
- **🔐 Enterprise-Grade Security & Authentication**:
  - Secure JWT authentication with short-lived Access Tokens (15 min) and Refresh Tokens (7 days).
  - Bcrypt password hashing (10 salt rounds) and strict input validation via `express-validator`.
  - Protected API routes, Helmet security headers, and rate limiting.
- **✨ Professional UI & UX**:
  - Bespoke vector brand identity and SVG iconography.
  - High-converting, clean landing page with an instant access portal and live fee calculator.
  - Full Dark Mode and Light Mode support with smooth Framer Motion transitions.

---

## 🏗️ Architecture

```
globepay/
├── package.json                  # Root workspace config
├── FINTECH/fintech-interface/    # React SPA Frontend
│   ├── public/                   # Static assets, SVG favicons, manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # ProtectedRoute guards
│   │   │   ├── common/           # GlobePayLogo vector component
│   │   │   └── layout/           # Sidebar, Topbar, Dashboard layout
│   │   ├── context/              # AuthContext (JWT) & ThemeContext
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # Professional marketing & 1-click access
│   │   │   ├── AuthPage.tsx      # Sign In / Sign Up portal
│   │   │   ├── QRScannerPage.tsx # Universal Scan & Pay viewfinder
│   │   │   ├── DashboardPage.tsx # Account overview & quick actions
│   │   │   ├── CardsPage.tsx     # Virtual card controls
│   │   │   └── ...               # Convert, Send, Rewards, Goals, Bills
│   │   └── services/api.ts       # Axios client with auto-refresh interceptors
│   └── server.js                 # Production static server (Port 5000)
│
└── backend/                      # Node.js + Express REST API
    ├── data/                     # SQLite persistent storage (globepay.db)
    └── src/
        ├── db/                   # Knex migrations, declarative schema & seed
        ├── middleware/           # JWT verification & error handlers
        ├── routes/               # Modular REST endpoints
        │   ├── auth.js           # Register, login, refresh, profile
        │   ├── wallets.js        # Balances, multi-currency creation
        │   ├── transactions.js   # 1-Tap send, atomic debits/credits
        │   ├── exchange.js       # Live FX rates
        │   ├── cards.js          # Virtual card issuance & freezing
        │   └── ...               # Savings, notifications, users
        ├── services/             # Live exchange rate calculation service
        └── index.js              # Express app bootstrap (Port 4000)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/upasanaX/Globepay-frontend.git globepay
cd globepay
```

### 2. Set Up the Backend
```bash
cd backend
npm install

# Initialize and seed the database with demo account and wallets
node src/db/seed.js

# Start the API server on Port 4000
npm start
```
> The API will be live at `http://localhost:4000/api` (Health check: `http://localhost:4000/api/health`).

### 3. Set Up the Frontend
```bash
# In a new terminal window:
cd FINTECH/fintech-interface
npm install

# Option A: Start React Development Server (Port 3000)
npm start

# Option B: Run Optimized Production Server (Port 5000)
npm run build
node server.js
```
> Open your browser to **`http://localhost:5000`** (or `http://localhost:3000`).

---

## 👤 Demo Account

For rapid evaluation, the database comes pre-seeded with a complete account:

| Field | Credentials |
|---|---|
| **Account Holder** | **Upasana Roy** |
| **Email** | `upasana.roy@email.com` |
| **Password** | `GlobePay@123` |
| **Initial Balances** | `$12,450.00 USD`, `€8,320.00 EUR`, `£5,100.00 GBP`, `¥450,000 JPY`, `₹150,000 INR` |

> ⚡ **Quick Access**: Click the **"⚡ 1-Click Demo Login (Upasana Roy)"** button directly on the landing page to enter without typing credentials.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & receive JWT access + refresh tokens |
| `POST` | `/api/auth/register` | Register new user & auto-provision initial USD wallet |
| `POST` | `/api/auth/refresh` | Rotate access token using valid refresh token |
| `GET` | `/api/wallets` | Retrieve all active multi-currency wallets and balances |
| `POST` | `/api/wallets` | Create a new currency wallet (USD, EUR, GBP, JPY, etc.) |
| `GET` | `/api/exchange/rate` | Get live FX conversion rate between two currency pairs |
| `POST` | `/api/transactions/send` | Execute 1-tap payment with automatic currency exchange |
| `GET` | `/api/transactions` | Retrieve paginated transaction history |
| `GET` | `/api/cards` | List virtual cards with masked numbers & status |
| `PATCH` | `/api/cards/:id/freeze` | Toggle freeze state on a virtual card |

---

## 🔒 Security Best Practices

- **Zero-Knowledge Token Architecture**: Refresh tokens are stored securely with SHA-256 fingerprinting. Access tokens expire in 15 minutes.
- **Password Protection**: Passwords hashed with bcrypt using 10 rounds of cryptographic salting.
- **SQL Injection Prevention**: All queries use parameterized Knex query builders.
- **HTTP Protection**: Configured with Helmet HTTP response headers and automated IP rate-limiting.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

