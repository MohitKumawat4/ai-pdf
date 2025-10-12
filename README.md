# ResumeAI - AI-Powered Resume Builder

A modern SaaS platform for an AI-powered resume maker and editor built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Magic UI
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans
- **Animations**: Framer Motion

## ✨ Features

### Landing Page
- **Dark Theme**: Modern dark-themed design with gradient accents
- **Retro Grid Background**: Animated retro grid effect
- **Shimmer Buttons**: Animated shimmer effect on CTAs
- **Border Beam Effects**: Animated border beams on feature cards
- **Animated Gradient Text**: Dynamic gradient text animations
- **Pricing Section**: Three-tier pricing (Free, Pro, Enterprise)
- **Responsive Design**: Mobile-first, fully responsive layout

### Authentication
- **Email/Password Auth**: Traditional signup and login
- **OAuth Integration**: Google and GitHub sign-in
- **Protected Routes**: Dashboard requires authentication
- **Session Management**: Automatic session refresh via middleware
- **Email Verification**: Confirmation emails for new accounts

### Database
- **Resume Storage**: Comprehensive resume data table with JSONB fields
- **User Isolation**: Row Level Security (RLS) ensures users only access their own data
- **Flexible Schema**: Support for education, skills, experience, projects, awards, and more
- **Multiple Resumes**: Users can create and manage multiple resumes
- **TypeScript Types**: Fully typed resume data structures

### UI Components
- Beautiful glassmorphic cards with backdrop blur
- Gradient icon backgrounds
- Hover animations and transitions
- Modern form inputs with icons
- Professional navigation and footer

## 🛠️ Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A Supabase account and project

### Environment Setup

1. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nlgxlzrxqbmacisufluu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZ3hsenJ4cWJtYWNpc3VmbHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDQ3MDUsImV4cCI6MjA3NTY4MDcwNX0.pqp_TJZokPJ_S3K7iDNN0KggtY2BpDJdbtAGSOF1L2s
```

2. Get your Supabase credentials:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Settings > API
   - Copy the `URL` and `anon` public key

See `ENV_SETUP.md` for detailed instructions.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design System

### Colors
- **Background**: #000000 (Pure Black)
- **Foreground**: #ffffff (White)
- **Cards**: #0a0a0a with backdrop blur
- **Borders**: White with 10% opacity
- **Accents**: Gradient combinations (purple-pink, blue-cyan, etc.)

### Typography
- **Font**: Plus Jakarta Sans (weights: 300-800)
- **Headings**: Bold, large scale (5xl-8xl)
- **Body**: Regular weight with good line height

### Components
- **Glassmorphism**: Cards with backdrop blur and transparency
- **Gradients**: Vibrant gradient backgrounds for icons and CTAs
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React library

## 📁 Project Structure

```
pdf-app-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with Plus Jakarta Sans
│   │   ├── page.tsx             # Landing page (dark theme)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Protected dashboard
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts     # OAuth callback handler
│   │   │   └── signout/
│   │   │       └── route.ts     # Sign out handler
│   │   └── globals.css          # Global styles + animations
│   ├── components/
│   │   └── ui/                  # UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── shimmer-button.tsx    # Magic UI
│   │       ├── retro-grid.tsx        # Magic UI
│   │       ├── border-beam.tsx       # Magic UI
│   │       └── animated-gradient-text.tsx  # Magic UI
│   ├── lib/
│   │   ├── utils.ts             # Utility functions
│   │   └── supabase/            # Supabase clients
│   │       ├── client.ts        # Browser client
│   │       ├── server.ts        # Server client
│   │       └── middleware.ts    # Auth middleware
│   └── middleware.ts            # Next.js middleware
├── public/                      # Static assets
├── components.json              # shadcn/ui configuration
├── ENV_SETUP.md                 # Environment setup guide
└── DATABASE_SCHEMA.md           # Database schema documentation
```

## 🧩 Components Used

### shadcn/ui
- Button
- Card
- Badge
- Input
- Label
- Form
- Separator

### Magic UI (Custom)
- ShimmerButton - Animated shimmer effect
- RetroGrid - Animated retro grid background
- BorderBeam - Animated border beam effect
- AnimatedGradientText - Gradient text with animation

### Icons
- Lucide React (Brain, Wand2, Rocket, FileText, etc.)

## 🔐 Authentication Flow

1. **Sign Up**: User creates account with email/password or OAuth
2. **Email Verification**: Confirmation email sent (for email/password)
3. **Sign In**: User logs in with credentials or OAuth
4. **Session Management**: Middleware refreshes sessions automatically
5. **Protected Routes**: Dashboard requires authentication
6. **Sign Out**: Clean session termination

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase Setup

1. Enable Email Auth in Supabase Dashboard
2. Configure OAuth providers (Google, GitHub)
3. Set up redirect URLs in OAuth provider settings
4. Add site URL in Supabase Auth settings
5. Database migrations are already applied (resumes table created)

## 📊 Database Schema

The application uses a comprehensive `resumes` table to store user resume data:

### Key Features
- **29 fields** covering all resume aspects
- **JSONB fields** for flexible structured data (education, skills, experience, etc.)
- **Text arrays** for simple lists (certificates, hobbies, languages)
- **Row Level Security** ensuring data privacy
- **Auto-updating timestamps** via triggers
- **Foreign key constraints** with cascade delete

### Main Fields
- Basic info: name, contact, email, address, social links
- Professional summary
- Education history (JSONB array)
- Skills (JSONB - categorized or simple)
- Work experience (JSONB array)
- Projects (JSONB array)
- Awards, achievements, certifications
- Volunteer work, publications, references
- Custom sections for flexibility

See `DATABASE_SCHEMA.md` for complete documentation and JSON structure examples.

## 📝 Notes

- All code includes comments for better understanding
- Follows SOLID principles and clean code practices
- TypeScript for type safety throughout
- Optimized for performance and SEO
- Fully responsive design
- Dark theme optimized for modern aesthetics
- Accessibility considerations (ARIA labels, semantic HTML)
