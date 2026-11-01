# GlobePay — Backend API Server

High-performance Node.js / Express REST API and multi-currency ledger engine for the **GlobePay** platform.

## Features
- **JWT Authentication**: Access tokens (15m) + refresh token rotation (7d) with bcrypt password hashing.
- **Persistent Multi-Currency Database**: SQLite + Knex declarative schema with automated startup migration.
- **Cross-Border Exchange Engine**: Real-time mid-market rate calculation with atomic wallet debit/credit settlement.
- **Security Middleware**: Helmet security headers, CORS origin verification, and express-rate-limit.

## Setup & Running

```bash
# Install dependencies
npm install

# Initialize and seed database with demo user (Upasana Roy)
node src/db/seed.js

# Start server on Port 4000
npm start
```

Health endpoint: `GET http://localhost:4000/api/health`

