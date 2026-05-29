# AR Typing Tutor

<div align="center">
  <h3>Multi-Language Typing Practice, Testing & Certification Platform</h3>
  <p>Practice typing in English, Urdu, Arabic, and Sindhi with real-time feedback, timed tests, and professional certificates.</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## Features

### Core Features
- **4 Languages**: English, Urdu (RTL), Arabic (RTL), Sindhi (RTL) with full RTL support
- **Practice Mode**: Random paragraphs, custom text, timed practice
- **Test Mode**: 1, 3, 5 minute timed tests with pass/fail evaluation
- **Real-Time Engine**: Live WPM, CPM, accuracy, mistake tracking
- **Certificate System**: Auto-generate PNG certificates on passing
- **QR Verification**: Verify certificates at `/verify/[certificateId]`
- **Leaderboard**: Daily, weekly, all-time rankings by language
- **PWA Support**: Install as a standalone app for offline access

### Admin Features
- **Professional Dashboard**: Real-time stats and quick actions
- **User Management**: Add users, ban/unban, change roles
- **Certificate Management**: Approve/reject requests multiple times
- **Paragraph Management**: Add, edit, delete, activate/deactivate paragraphs
- **Test Configuration**: Customize passing criteria (WPM, accuracy, mistakes)
- **Account Settings**: Update admin profile, email, and password

### UI/UX
- **Modern Design**: Glassmorphism with gradient backgrounds
- **Dark Mode Only**: Clean, eye-friendly dark theme
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Works perfectly on mobile, tablet, desktop

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | Neon PostgreSQL |
| **ORM** | Prisma |
| **Auth** | NextAuth v5 (Credentials) |
| **Animations** | Framer Motion |
| **Certificates** | html-to-image (PNG generation) |
| **Validation** | Zod + React Hook Form |
| **PWA** | Service Workers + Web App Manifest |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### 1. Clone the repository
```bash
git clone <repository-url>
cd ar-typing-tutor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
First, copy the example environment file:
```bash
cp .env.example .env
```

Then open `.env` and fill in your values:
```env
# Database (Neon PostgreSQL recommended)
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Public App URL (for QR codes, must match NEXTAUTH_URL)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**How to generate NEXTAUTH_SECRET:**
```bash
# Run this in your terminal
openssl rand -base64 32
```

### 4. Set Up Database
1. Create a PostgreSQL database (we recommend [Neon](https://neon.tech) for free tier)
2. Push the Prisma schema to your database:
```bash
npm run db:push
```

### 5. Seed Initial Data
```bash
npm run db:seed
```

This creates:
- **Admin User**: `admin@artyping.com` / `admin123`
- **Test User**: `user@artyping.com` / `user123`
- 12 typing paragraphs (3 per language × 4 languages)

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Commands
```bash
npm run db:generate   # Generate Prisma Client
npm run db:push       # Push schema to database
npm run db:migrate    # Create and apply migrations
npm run db:seed       # Seed initial data
npm run db:studio     # Open Prisma Studio (GUI for database)
```

---

## Project Structure
```
ar-typing-tutor/
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service Worker
│   └── icons/               # App icons
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin panel (protected)
│   │   ├── api/auth/        # NextAuth API route
│   │   ├── certificates/    # User certificates page
│   │   ├── dashboard/       # User dashboard
│   │   ├── leaderboard/     # Rankings page
│   │   ├── practice/        # Practice mode
│   │   ├── test/            # Test mode
│   │   ├── verify/[id]/     # Certificate verification page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── actions/             # Server Actions
│   │   ├── admin.ts         # Admin-related actions
│   │   ├── auth.ts          # Auth-related actions
│   │   ├── certificates.ts  # Certificate actions
│   │   └── tests.ts         # Test-related actions
│   ├── components/
│   │   ├── certificate/     # Certificate components
│   │   ├── layout/          # Layout components (Navbar, etc.)
│   │   ├── typing/          # Typing engine components
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── paragraphs.ts    # Default paragraph data
│   │   ├── prisma.ts        # Prisma client instance
│   │   ├── utils.ts         # Utility functions
│   │   └── validations.ts   # Zod validation schemas
│   ├── middleware.ts        # Route protection middleware
│   └── types/               # TypeScript type definitions
├── .env.example             # Example environment variables
├── package.json
└── tsconfig.json
```

---

## Certificate Workflow
1. User takes a timed test
2. If passed → Certificate Request auto-created (status: PENDING)
3. Admin reviews → Approves or Rejects
4. If Approved → Certificate generated with unique number
5. User downloads high-quality PNG certificate
6. Anyone can verify authenticity at `/verify/[certificateNumber]`

---

## Test Passing Criteria
Admin-configurable via `/admin/config`:
- Default Minimum WPM: **35**
- Default Minimum Accuracy: **90%**
- Default Maximum Mistakes: **10**

---

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (Neon connection string)
   - `NEXTAUTH_SECRET` (random 32+ character string)
   - `NEXTAUTH_URL` (your Vercel URL, e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` (same as NEXTAUTH_URL)
4. Deploy!

### Other Platforms
The app can be deployed on any platform that supports Node.js:
- AWS Amplify
- Netlify
- DigitalOcean App Platform
- Render

---

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## License
MIT License - feel free to use this project for personal or commercial purposes.
