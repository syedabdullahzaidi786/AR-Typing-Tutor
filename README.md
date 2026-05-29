# AR Typing Tutor

A complete multi-language typing practice, testing, and certification platform built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL.

## Features

- **4 Languages**: English, Urdu (RTL), Arabic (RTL), Sindhi (RTL)
- **Practice Mode**: Random paragraphs, custom text, timed practice
- **Test Mode**: 1, 3, 5 minute timed tests with pass/fail evaluation
- **Real-Time Engine**: Live WPM, CPM, accuracy, mistake tracking
- **Certificate System**: Auto-generate PNG certificates on passing
- **QR Verification**: Verify certificates at `/verify/[certificateId]`
- **Leaderboard**: Daily, weekly, all-time rankings by language
- **Admin Panel**: Manage users, paragraphs, certificates, test config
- **Dark Mode**: Glassmorphism design with Framer Motion animations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth v5 (Credentials)
- **Animations**: Framer Motion
- **Certificates**: html-to-image (PNG generation)
- **Validation**: Zod + React Hook Form

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup (Neon PostgreSQL)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run migrations:

```bash
npm run db:push
```

### 4. Seed Database

```bash
npm run db:seed
```

This creates:
- Admin: `admin@artyping.com` / `admin123`
- User: `user@artyping.com` / `user123`
- 12 typing paragraphs (3 per language × 4 languages)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Create migration
npm run db:seed       # Seed initial data
npm run db:studio     # Open Prisma Studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── admin/              # Admin panel
│   │   ├── certificates/
│   │   ├── config/
│   │   ├── paragraphs/
│   │   ├── tests/
│   │   └── users/
│   ├── api/auth/           # NextAuth API route
│   ├── certificates/       # User certificates
│   ├── dashboard/          # User dashboard
│   ├── leaderboard/        # Rankings
│   ├── practice/           # Practice mode
│   ├── test/               # Test mode
│   └── verify/[id]/        # Certificate verification
├── actions/                # Server Actions
│   ├── admin.ts
│   ├── auth.ts
│   ├── certificates.ts
│   └── tests.ts
├── components/
│   ├── certificate/        # Certificate card + download
│   ├── layout/             # Navbar
│   ├── typing/             # Typing engine, language selector
│   └── ui/                 # Button, Input, Card, Badge
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── paragraphs.ts       # Default paragraph data
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod schemas
├── middleware.ts            # Route protection
└── types/                  # TypeScript types
```

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
   - `NEXTAUTH_SECRET` (random 32+ char string)
   - `NEXTAUTH_URL` (your Vercel URL)
4. Deploy

## Test Passing Criteria (Admin Configurable)

Default:
- Minimum WPM: **35**
- Minimum Accuracy: **90%**
- Maximum Mistakes: **10**

## Certificate Workflow

1. User takes a timed test
2. If passed → Certificate Request auto-created (PENDING)
3. Admin reviews → Approves or Rejects
4. If Approved → Certificate generated with unique number
5. User downloads PNG certificate
6. Anyone can verify at `/verify/[certificateNumber]`
"# AR-Typing-Tutor" 
