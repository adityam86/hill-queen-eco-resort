# HILL QUEEN ECO RESORT — PRODUCTION-READY WEBSITE

> **Official Website:** [https://hillqueenecoresorts.com](https://hillqueenecoresorts.com)  
> **Location:** Mamudi, Murguma, Purulia, West Bengal, India  
> **Business Model:** Luxury Nature / Eco-Resort Hospitality (Direct Enquiries via WhatsApp & Telephone — No Third-Party Booking Engine or Payment Gateway Fees)

---

## 1. Project Overview

Hill Queen Eco Resort is an exclusive, luxury nature retreat situated in the tranquil valley of Mamudi near the scenic Murguma Dam and the Ajodhya Hills in Purulia, West Bengal.

This web application is custom-engineered using **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. It enables prospective guests to explore cottages and rooms, view verified approved tariffs in Indian Rupees (INR), browse high-resolution categorized photo galleries, discover nearby Purulia attractions, and initiate direct booking enquiries directly via **WhatsApp** and **Telephone**.

The resort owner can independently manage room prices, room descriptions, facilities, photographs, and contact numbers through a protected, authenticated **Admin Dashboard** (`/admin`), requiring zero developer intervention or source code edits.

---

## 2. Technology Stack & Architecture

- **Framework:** Next.js 14+ (App Router, Server Components & Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom luxury branding tokens (Forest Green `#182B25`, Deep Olive `#344536`, Warm Ivory `#F2EEDF`, Champagne Gold `#C6AD75`, Soft Sage `#87917A`)
- **Typography:** Playfair Display (Headings) & Inter (Body)
- **Database Layer:** Prisma ORM with Multi-Engine Adaptability:
  - **SQLite** (Default for instant local execution & zero-dependency testing)
  - **MySQL** (Standard for GoDaddy cPanel MySQL databases)
  - **PostgreSQL** (For Supabase, Neon, or managed PostgreSQL servers)
- **Authentication:** Password hashing via `bcryptjs`, signed sessions via `jose` (HS256), secure HTTP-only cookies, and brute-force rate limiting.
- **Icons:** Lucide Icons
- **Image Optimization:** Next.js Responsive Images with local uploads saved to `/public/uploads/` with file type and size validation.

---

## 3. Verified Contact Information

As sourced from the verified resort visiting card:
- **Primary Telephone:** `+91 9735888106`
- **Secondary Phone:** `+91 9733713255`
- **Desk Phone:** `+91 8670214030`
- **WhatsApp Direct:** `+91 9735888106`
- **Official Email:** `hillqueenecoresort@gmail.com`
- **Address:** Mamudi, Murguma, Purulia, West Bengal, India
- **Standard Timings:** Check-in: 11:00 AM | Check-out: 10:00 AM

*Note: All contact details are dynamic and editable by the resort owner from the Admin Dashboard at `/admin/settings`.*

---

## 4. WhatsApp Enquiry System

When a guest clicks any **"Enquire on WhatsApp"** button on a room card or room detail page, a formatted, pre-filled message is generated automatically:

```text
Hello Hill Queen Eco Resort,
I would like to enquire about:
Room: [Room Name]
Price shown: ₹[Displayed Price]
Please share the current availability and details.
Thank you.
```

The website also includes:
- **Floating WhatsApp Widget:** Fixed bottom-right with subtle notification badge.
- **Mobile Quick Drawer:** Sticky bottom bar on mobile screens with 1-tap "Call Resort", "WhatsApp", and "View Rooms".
- **Contact Enquiry Builder:** Generates an organized WhatsApp message with guest dates, count, and special requests.

---

## 5. Local Setup & Quick Start

### Prerequisites
- Node.js 18.x, 20.x, or 22.x
- npm 9+ or 10+

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd "hill view resort"
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default local `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="hill-queen-resort-super-secret-jwt-key-change-in-production-2026"
ADMIN_SESSION_COOKIE="hq_admin_session"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_PHONE="9735888106"
NEXT_PUBLIC_DEFAULT_WHATSAPP="9735888106"
NEXT_PUBLIC_DEFAULT_EMAIL="hillqueenecoresort@gmail.com"
```

### Step 3: Initialize Database & Seed
```bash
# Push schema to SQLite
npm run db:push

# Seed verified contact info, rooms, facilities, and initial admin
npm run db:seed
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website.

---

## 6. Admin Portal & Authentication

- **Admin URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Username:** `admin`
- **Default Email:** `admin@hillqueenecoresorts.com`
- **Default Password:** `AdminPassword@2026`

*(Important: Change this password immediately after first login at `/admin/password` or via the secure CLI script below).*

### CLI Admin Creation / Password Reset
To create an admin or reset a password without using the web UI:
```bash
npm run db:create-admin
```

---

## 7. Database Engine Switching (SQLite / MySQL / PostgreSQL)

The project includes an automated database switcher script so that deployment can be adapted to any hosting environment:

```bash
# Switch to MySQL (Standard for GoDaddy cPanel MySQL)
npm run db:switch mysql

# Switch to PostgreSQL (For Supabase, Neon, or cloud Postgres)
npm run db:switch postgresql

# Switch back to SQLite (For local testing)
npm run db:switch sqlite
```

After switching providers:
1. Update `DATABASE_URL` in `.env` to match your database credentials.
2. Run `npm run db:generate`
3. Run `npm run db:push`
4. Run `npm run db:seed`

---

## 8. GoDaddy cPanel Deployment Guide

### Hosting Compatibility Checklist
1. **Node.js Selector:** GoDaddy cPanel "Setup Node.js App" feature must be enabled.
2. **Supported Node Version:** Node.js 18, 20, or 22.
3. **Database:** Standard cPanel MySQL database (create via cPanel MySQL Database Wizard).
4. **Persistent Process:** Passenger or PM2 runner.

### Step-by-Step cPanel Deployment

#### Step 1: Create the MySQL Database on cPanel
1. Log in to your GoDaddy cPanel.
2. Navigate to **MySQL Databases**.
3. Create a new database: e.g. `cpaneluser_hillqueen`.
4. Create a new MySQL user and password: e.g. `cpaneluser_resort`.
5. Add the user to the database and grant **ALL PRIVILEGES**.

#### Step 2: Prepare Application for MySQL
On your local machine or build server:
```bash
npm run db:switch mysql
```
Set your production `.env` with the MySQL connection string:
```env
DATABASE_URL="mysql://cpaneluser_resort:YourPassword@localhost:3306/cpaneluser_hillqueen"
JWT_SECRET="generate-a-strong-32-character-random-secret"
ADMIN_SESSION_COOKIE="hq_admin_session"
NEXT_PUBLIC_SITE_URL="https://hillqueenecoresorts.com"
NODE_ENV="production"
```

#### Step 3: Production Build
```bash
npm run build
```
Next.js outputs a standalone bundle in `.next/standalone`.

#### Step 4: Upload to cPanel
> **CRITICAL WARNING:** Never overwrite the existing `public_html` directory without creating a full cPanel backup first!

1. In cPanel File Manager, create an application directory outside `public_html` (e.g., `/home/username/hillqueen-app/`).
2. Upload the project files:
   - `.next/`
   - `public/`
   - `prisma/`
   - `scripts/`
   - `package.json`
   - `.env`
3. If using Next.js Standalone mode, copy `public/` and `.next/static` into `.next/standalone/`.

#### Step 5: Configure Node.js Application in cPanel
1. In cPanel, click **Setup Node.js App**.
2. Click **Create Application**.
3. Select **Node.js version** (20.x or 22.x).
4. **Application mode:** `Production`.
5. **Application root:** `hillqueen-app` (or path where files were uploaded).
6. **Application URL:** `hillqueenecoresorts.com`.
7. **Application startup file:** `server.js` (or `.next/standalone/server.js`).
8. Click **Create**.
9. Run `npm install --omit=dev` and `node scripts/seed.mjs` via cPanel terminal.
10. Click **Restart Application**.

#### Step 6: SSL Configuration
1. In cPanel, navigate to **SSL/TLS Status**.
2. Ensure **AutoSSL** or **Let's Encrypt** is active for `hillqueenecoresorts.com` and `www.hillqueenecoresorts.com`.
3. Enable HTTPS redirect in cPanel Domains settings.

### Deployment Alternative: Cloud / VPS with cPanel DNS
If your GoDaddy shared cPanel plan does not support persistent Node.js processes or Phusion Passenger:
- Host the Next.js production build on a managed Node platform (e.g. Vercel, Railway, Render, or a DigitalOcean droplet).
- Keep `hillqueenecoresorts.com` on GoDaddy, and point the DNS **A record** / **CNAME** to the hosting server.
- This provides 100% uptime, automated SSL, and zero cPanel Passenger process limitations.

---

## 9. Backup & Rollback Procedures

### Database Backup
- **SQLite:** Simply backup the single file `prisma/dev.db`.
- **MySQL (cPanel):** Open **phpMyAdmin**, select the database, click **Export**, and download the `.sql` backup.

### Media & Uploads Backup
All owner-uploaded photographs are saved in:
```text
/public/uploads/
```
Back up this directory during regular site maintenance to preserve client photographs.

---

## 10. SEO Implementation

The website is comprehensively optimized for Google Search and Local Discovery targeting:
- `Hill Queen Eco Resort`
- `Hill Queen Eco Resort Murguma`
- `Resort in Murguma Purulia`
- `Hotels near Murguma Dam`
- `Resort in Purulia West Bengal`
- `Accommodation in Murguma`

Features:
- Unique semantic page titles & meta descriptions
- JSON-LD Structured Data Schema (`Resort` / `LodgingBusiness`) without fake ratings
- Dynamic XML sitemap at `/sitemap.xml`
- Robots file at `/robots.txt`
- Open Graph social share previews
