# PDF Resume Builder

A modern AI-powered resume builder that helps users generate professional resumes with intelligent content suggestions and real-time previews. The application combines Supabase for persistence, Google Gemini for AI-powered descriptions, and a carefully crafted UI using shadcn/ui, Magic UI, and Aceternity components.

## Features

- **Resume creation workflow**: Guided form for profile, education, experience, skills, and more, stored securely in Supabase.
- **AI description generation**: Gemini and OpenRouter integrations create impactful summaries, experience highlights, and project descriptions.
- **Real-time preview**: A4-sized preview with clickable hyperlinks and PDF export that mirrors the on-screen template.
- **Dashboard**: Manage multiple resumes, edit existing entries, and access AI tooling from a unified interface.

## Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript with strict linting
- **UI**: Tailwind CSS, shadcn/ui, Magic UI, Aceternity components, Lucide icons
- **AI Providers**: Google Gemini (via `@google/genai`), OpenRouter GPT-OSS-20B
- **Backend**: Supabase (Postgres, Auth, Storage)

## Prerequisites

- Node.js 20+
- Supabase project configured and connected
- API keys for Google AI Studio and OpenRouter stored in `.env`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_AUTH_SECRET=
NEXT_GOOGLE_AI_STUDIO_KEY=
NEXT_OPENROUTER_API_KEY=
```

## Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start the development server (Turbopack)
npm run lint     # Run ESLint checks
```

## PDF Export

The preview page (`src/app/resume/[id]/preview/page.tsx`) renders a true A4 layout and exports pixel-perfect PDFs using `html2canvas` and `jspdf`. All hyperlinks remain active in the generated document.

## Project Structure

```text
src/
  app/
    api/                 # AI description routes
    resume/              # Resume creation, view, preview pages
    dashboard/           # Resume dashboard
  components/            # Reusable UI components
  lib/                   # Supabase helpers, utilities
  types/                 # Shared TypeScript definitions
```

## Deployment

- Ensure Supabase credentials and AI keys are provisioned in the hosting environment.
- Build using `next build` (when ready for production deployment).
- Configure CORS and RLS policies in Supabase per `supabase-integration.md` guidance.

## License

This project is proprietary to the PDF Resume Builder team.
