# PrintFlow SaaS — QR-Based Self-Service Auto-Printing

> Self-service QR printing platform designed for Indian cyber cafés, Xerox shops, CSC centres, and colleges.

---

## 🚀 Quick Start (Week 1 Setup)

### 1. Install Dependencies
```bash
cd c:\TheSalimLabs\printflow
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The dev server runs out-of-the-box with built-in storage and memory fallback even before configuring Postgres credentials).*

### 3. Database Migration & Prisma
When your PostgreSQL database (e.g., Supabase, Neon, or local Postgres) is running:
```bash
# Push schema to database
npm run db:push

# Or apply versioned migration
npx prisma migrate deploy

# Seed demo shop ("Sharma Cyber Cafe")
npm run db:seed
```

### 4. Start Next.js App
```bash
npm run dev
```
Visit:
- **Landing Page:** [http://localhost:3000](http://localhost:3000)
- **Customer QR Scan Flow (Demo Shop):** [http://localhost:3000/print/sharma-cyber-cafe](http://localhost:3000/print/sharma-cyber-cafe)
- **Shopkeeper Console & Queue:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 🖨️ Running the Windows Print Agent

In a separate terminal on the shop computer:
```bash
node agent/printflow-agent.mjs
```
The agent authenticates with token `agent_sharma_cyber_live_token_99x`, polls the API for approved/paid jobs, simulates or invokes silent printing, updates status to `PRINTED`, and immediately purges downloaded files for privacy.

---

## 🏗️ Architecture & Features Built in Week 1

| Feature | Description |
| :--- | :--- |
| **Mobile-First PWA UI** | Customer scans counter QR, uploads PDF/JPG/PNG, selects B&W/Colour, Single/Duplex sides, copies, and calculates live price. |
| **Aadhaar / Password PDF Field** | Prevents Windows silent print hanging when printing password-locked e-Aadhaar or bank statements. |
| **Pay-at-Counter 1-Click Approval** | Customer orders without online payment; shopkeeper gets 1-click **"Approve & Print"** on their screen. |
| **Prisma Schema & PostgreSQL Migration** | Complete schema covering `Shop`, `User`, `Printer`, `PricingRule`, `PrintJob`, `Payment`, `JobLog`, and `Subscription`. |
| **Storage Abstraction** | Local disk storage with auto-created upload directory, pluggable for Cloudflare R2 / AWS S3 in production. |
| **Privacy Auto-Purge** | Temporary files are automatically wiped upon successful printing acknowledgment. |
| **Dynamic QR Generator** | Generates crisp SVG counter standees at `/api/qr/[slug]` ready to print and place on Xerox counters. |

---

## 📡 API Endpoints Reference

- `GET /api/shops/:slug` — Fetch shop details, printers, and pricing rules
- `POST /api/jobs` — Customer upload & print job creation (multipart/form-data)
- `GET /api/jobs?shopId=...` — Live queue for shop dashboard
- `GET /api/jobs/:id` — Polling individual job status for customer screen
- `POST /api/jobs/:id/counter-approve` — 1-click shopkeeper approval for counter payment
- `GET /api/agent/jobs` — Windows agent polling queue (authenticated via Bearer token)
- `POST /api/agent/jobs/:id/status` — Agent reporting `PRINTING`, `PRINTED`, or `FAILED`
- `GET /api/qr/:slug` — Printable SVG QR code for counter standee
- `GET /api/files/:key` — Secure file streaming for download/preview
