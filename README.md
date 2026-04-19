# SolarServ Solutions

A full-stack B2C solar panel maintenance and service scheduling platform. Homeowners can register solar assets, book cleaning/inspection/maintenance services, and track service history. Operators and admins manage requests, technicians, and monitor the network via a dedicated dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Clerk v7 |
| Database | Neon (PostgreSQL) |
| ORM | Prisma 7 |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet + OpenStreetMap |
| File Uploads | Cloudinary |
| Deployment | Vercel |

---

## Features

### Homeowner Portal
- Sign up / sign in via Clerk
- Register solar assets (brand, capacity, panel count, GPS coords, photo upload, asset type)
- Book on-demand services — Cleaning, Inspection, Maintenance
- View service history with status timeline
- Notifications feed (booking confirmations, technician en-route, completions)

### Admin / Operator Dashboard
- KPI summary — total users, assets, open requests, completions, efficiency
- Geographic map view of all solar installations (Leaflet + OpenStreetMap)
- Service request management — filter, assign technicians, update status
- User management — live roles from Clerk, asset types per user

---

## Repository Structure

```
SolarServSolutions/
├── solarserv-app/                        # Next.js application
│   ├── app/
│   │   ├── (homeowner)/                  # Homeowner portal routes
│   │   │   ├── dashboard/
│   │   │   ├── assets/
│   │   │   ├── book/
│   │   │   ├── history/
│   │   │   └── notifications/
│   │   ├── (admin)/                      # Admin/operator dashboard routes
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── map/
│   │   │       ├── requests/
│   │   │       └── users/
│   │   ├── api/                          # API route handlers
│   │   │   ├── assets/
│   │   │   ├── bookings/
│   │   │   ├── notifications/
│   │   │   ├── admin/
│   │   │   └── webhooks/clerk/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── components/
│   │   ├── admin/                        # AdminSidebar
│   │   ├── homeowner/                    # HomeNav
│   │   └── ui/                           # StatusBadge
│   ├── lib/
│   │   ├── prisma.ts                     # Prisma client singleton (Neon adapter)
│   │   └── auth.ts                       # Clerk auth helpers + lazy user sync
│   ├── prisma/
│   │   └── schema.prisma                 # Database schema
│   └── proxy.ts                          # Clerk middleware + role-based routing
├── stitch_solarserv_service_platform/    # UI design assets (HTML mockups)
└── Solar_Service_Solution_Presentation.pdf
```

---

## Getting Started

### 1. Install dependencies

```bash
cd solarserv-app
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

```env
# Neon PostgreSQL
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Clerk Webhook (register endpoint in Clerk Dashboard)
CLERK_WEBHOOK_SECRET="whsec_..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="solarserv_assets"
```

### 3. Push the database schema

```bash
npx prisma migrate dev --name init
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Role Management

Roles are stored in **Clerk's `publicMetadata`** — no separate admin sign-up flow.

| Role | Access | Set via |
|---|---|---|
| *(unset)* | Homeowner portal | Default on sign-up |
| `operator` | Admin dashboard (read + update) | Clerk Dashboard → User → Public metadata |
| `admin` | Full admin dashboard | Clerk Dashboard → User → Public metadata |

To promote a user to admin:
1. Go to [Clerk Dashboard](https://clerk.com) → **Users** → select user
2. Edit **Public metadata** → set `{ "role": "admin" }`
3. User must sign out and sign back in

Admin and operator users are automatically redirected to `/admin/dashboard` after login.

---

## Clerk Webhook Setup

The webhook syncs new Clerk users into the Neon database automatically.

1. In Clerk Dashboard → **Webhooks** → **Add Endpoint**
2. URL: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Events: select `user.created`
4. Copy the **Signing Secret** → add to `.env` as `CLERK_WEBHOOK_SECRET`

---

## Cloudinary Upload Preset

1. Cloudinary Dashboard → **Settings** → **Upload** → **Upload Presets**
2. Click **Add upload preset**
3. Set name: `solarserv_assets`, Signing mode: **Unsigned**
4. Optional folder: `solarserv/assets`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Set **Root Directory** to `solarserv-app`
4. Add all environment variables from `.env`
5. Deploy — `prisma generate` runs automatically via the `postinstall` script

```bash
# Build command (auto-configured in package.json)
prisma generate && next build
```
