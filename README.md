# BizFinder

AI-powered business discovery using Apify + Google Maps.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** (PostgreSQL)
- **Resend** (OTP emails)
- **Apify** (Google Maps scraping)
- **Tailwind CSS** (Amber/dark theme)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — any random secret (e.g. `openssl rand -base64 32`)
- `RESEND_API_KEY` — from resend.com
- `FROM_EMAIL` — your verified sender email
- `APIFY_ACTOR_ID` — your actor ID (e.g. `yourname/google-maps-scraper`)

### 3. Set up database

```bash
npm run db:generate
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User Flow

1. User visits `/` → landing page
2. User goes to `/auth` → enters name + email
3. OTP is sent via Resend → user verifies
4. If no Apify key → redirected to `/settings/apify-key`
5. User pastes their Apify token → it's validated & saved
6. User goes to `/search` → fills in Type of Business, Sub-category (optional), Location, Max Results
7. Actor runs on Apify → results rendered with expandable cards

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # send-otp, verify-otp, logout, me
│   │   ├── apify-key/     # save/remove Apify key
│   │   └── search/        # run Apify actor
│   ├── auth/              # Login page
│   ├── dashboard/         # Dashboard
│   ├── search/            # Search page
│   └── settings/
│       └── apify-key/     # API key settings
├── components/
│   ├── AppShell.tsx       # Sidebar + nav
│   ├── AuthForm.tsx       # Login + OTP form
│   ├── ApifyKeyForm.tsx   # Key management
│   └── SearchInterface.tsx # Search + results
├── lib/
│   ├── prisma.ts          # DB client
│   ├── auth.ts            # Session management
│   ├── otp.ts             # OTP generation/verification
│   ├── email.ts           # Resend integration
│   ├── apify.ts           # Apify actor runner
│   └── utils.ts           # cn helper
├── types/
│   └── index.ts           # Shared TypeScript types
└── middleware.ts           # Route protection
```

## Apify Actor Configuration

Your actor should accept:
- `searchStringsArray` — array of search terms
- `locationQuery` — city/location string
- `maxCrawledPlacesPerSearch` — limit
- `includeOpeningHours` — boolean

And return items matching the `BusinessResult` type in `src/types/index.ts`.

The default actor ID is set to `compass/google-maps-scraper` — update `APIFY_ACTOR_ID` to point to your custom actor.
