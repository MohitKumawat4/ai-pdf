# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 AI-powered resume builder with Supabase backend, Google Gemini AI integration, and multi-template PDF export. Users create, manage, and export professional resumes with AI-generated descriptions.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server with Turbopack
npm run build        # Production build with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint checks

# No test suite is currently configured
```

## Environment Setup

Required environment variables (create `.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Services
NEXT_GOOGLE_AI_STUDIO_KEY=      # For Google Gemini 2.0 Flash
NEXT_OPENROUTER_API_KEY=        # For GPT-OSS-20B (alternative AI)

# Auth (if needed)
NEXT_AUTH_SECRET=
```

## Architecture

### Supabase Client Pattern (Critical)

The codebase uses **THREE different Supabase client creation patterns** - always use the correct one:

1. **Client Components** (`src/lib/supabase/client.ts`):
   - Use `createClient()` from `@/lib/supabase/client`
   - Browser-side authentication and data fetching
   - Used in `"use client"` components

2. **Server Components** (`src/lib/supabase/server.ts`):
   - Use `createClient()` from `@/lib/supabase/server`
   - Server-side rendering with automatic cookie handling
   - Used in Server Components and API routes that need auth context

3. **Middleware** (`src/lib/supabase/middleware.ts`):
   - Use `updateSession()` from `@/lib/supabase/middleware`
   - Session refresh on every request
   - Only used in `src/middleware.ts`

**Never mix these patterns** - importing the wrong client will cause authentication bugs.

### Resume Service Layer

All database operations go through `src/lib/supabase/resume-service.ts`:
- `getUserResumes()` - Fetch all user resumes
- `getResumeById(id)` - Fetch single resume
- `createResume(data)` - Create new resume (auto-adds user_id)
- `updateResume(id, updates)` - Update existing resume
- `deleteResume(id)` - Delete resume
- `duplicateResume(id)` - Clone resume with "(Copy)" suffix
- `toggleResumeActive(id, boolean)` - Toggle active status

**Never write direct Supabase queries in components** - always use these service functions.

### AI Integration Architecture

Two AI providers with fallback strategy:

1. **Google Gemini** (Primary) - `/api/generate-description-gemini`:
   - Model: `gemini-2.0-flash-exp`
   - SDK: `@google/genai`
   - Requires: `NEXT_GOOGLE_AI_STUDIO_KEY`

2. **OpenRouter GPT** (Alternative) - `/api/generate-description`:
   - Model: GPT-OSS-20B
   - Requires: `NEXT_OPENROUTER_API_KEY`

**AI Description Types:**
- `summary` - Professional summaries (2-3 sentences)
- `experience` - Job descriptions with bullet points
- `project` - Project descriptions with impact metrics
- `general` - Fallback for other content

The `AIDescriptionGenerator` component (`src/components/resume/ai-description-generator.tsx`) allows users to select between models.

### PDF Generation System

**Server-side rendering via API route** (`src/app/api/generate-pdf/route.ts`):

1. Client sends resume data to `/api/generate-pdf`
2. Server selects template based on `resume.template_id`
3. Server renders React component using `@react-pdf/renderer`
4. Server streams PDF buffer back to client

**Available Templates** (all in `src/components/pdf-templates/`):
- `classic` → `classic-pdf.tsx` (default)
- `modern` → `modern-pdf.tsx`
- `minimal` → `minimal-pdf.tsx`
- `professional`, `creative`, `executive` → `professional-pdf.tsx`
- `emerald`, `elegant`, `slate` → `emerald-pdf.tsx`

**When creating new templates:**
- Use `@react-pdf/renderer` components (Document, Page, View, Text)
- Export a component accepting `{ resume: Resume }` prop
- Add template mapping in `/api/generate-pdf/route.ts`
- Templates must be server-compatible (no DOM APIs)

### Resume Data Structure

Central type in `src/types/resume.ts`:

```typescript
interface Resume {
  // Metadata (auto-managed)
  id: string
  user_id: string
  created_at: string
  updated_at: string

  // User-managed
  title: string
  is_active: boolean
  template_id?: string

  // Profile
  full_name: string
  email: string
  contact_number: string
  profile_picture?: string
  linkedin_url?: string
  portfolio_url?: string
  github_url?: string

  // Content (JSONB in database)
  professional_summary?: string
  education: EducationEntry[]
  skills: SkillCategory[] | string[]
  experience?: ExperienceEntry[]
  projects?: ProjectEntry[]
  awards?: AwardEntry[]
  certificates?: string[]
  hobbies?: string[]
  communication_languages: string[]

  // Advanced sections
  volunteer_work?: VolunteerEntry[]
  publications?: PublicationEntry[]
  professional_references?: ReferenceEntry[]
  custom_sections?: CustomSection[]
}
```

**Type Safety Rules:**
- Use `CreateResumeInput` when creating (omits auto-generated fields)
- Use `UpdateResumeInput` when updating (all fields optional except id)
- Arrays default to `[]`, not `null`

### Route Structure

```
src/app/
├── page.tsx                    # Landing page
├── login/page.tsx              # Login page
├── signup/page.tsx             # Signup page
├── dashboard/page.tsx          # User dashboard (server component)
│   └── dashboard-content.tsx   # Client component with interactivity
├── templates/page.tsx          # Template gallery
├── saved-resumes/page.tsx      # Resume management
├── resume/
│   ├── create/page.tsx         # New resume form
│   ├── [id]/page.tsx           # Edit resume
│   ├── [id]/preview/page.tsx   # PDF preview & export
│   ├── [id]/templates/page.tsx # Template selection
│   └── [id]/manage/page.tsx    # Resume management actions
├── api/
│   ├── generate-pdf/route.ts           # Server-side PDF generation
│   ├── generate-description/route.ts    # OpenRouter AI
│   └── generate-description-gemini/route.ts  # Google Gemini AI
└── auth/
    ├── callback/route.ts       # Supabase OAuth callback
    └── signout/route.ts        # Sign out handler
```

**Server vs Client Component Pattern:**
- Pages are Server Components by default
- Client interactivity in separate `-content.tsx` files
- This pattern allows data fetching in parent, interactivity in child

### UI Component Sources

Three component libraries are mixed:

1. **shadcn/ui** (`src/components/ui/` - basic components):
   - Installed via `npx shadcn@latest add <component>`
   - Config in `components.json` (New York style, Lucide icons)
   - Base components: Button, Card, Input, Label, Form, etc.

2. **Magic UI** (animated components):
   - Shimmer Button, Border Beam, Animated Gradient Text
   - Installed via Magic UI registry

3. **Aceternity UI** (advanced effects):
   - Background Gradient Animation, Lamp, Vortex, Retro Grid
   - Registry configured in `components.json`
   - Installed via Aceternity registry

**When adding UI components:**
- Check if shadcn/ui has it first
- Use Magic UI for animations and effects
- Use Aceternity for background effects and hero sections

### Authentication & Middleware

**Middleware** (`src/middleware.ts`):
- Runs on all routes (except static files)
- Refreshes Supabase session automatically
- Uses `updateSession()` from `@/lib/supabase/middleware`

**Protected Routes:**
- No explicit route protection in middleware
- Protection happens in pages via `createClient()` + `auth.getUser()`
- Unauthenticated users should be redirected to `/login`

**Auth Flow:**
- Sign up/Login → Supabase Auth → OAuth callback (`/auth/callback`) → Dashboard
- Sign out → `/auth/signout` route → Redirects to home

### Path Aliases

Configured in `tsconfig.json`:

```typescript
"@/*" → "./src/*"
```

Always use `@/` imports for consistency:
- `@/components/ui/button`
- `@/lib/supabase/client`
- `@/types/resume`

## Common Patterns

### Creating a new resume:

```typescript
import { createResume } from '@/lib/supabase/resume-service';

const newResume = await createResume({
  title: "Software Engineer Resume",
  full_name: "John Doe",
  email: "john@example.com",
  contact_number: "+1234567890",
  education: [],
  skills: [],
  communication_languages: ["English"],
  // user_id is automatically added
  // is_active defaults to true
});
```

### Generating AI descriptions:

```typescript
const response = await fetch('/api/generate-description-gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "Senior Software Engineer with 5 years in React",
    type: 'summary',
    context: 'Full-stack developer specializing in web applications'
  })
});

const { description, model } = await response.json();
```

### Exporting PDF from client:

```typescript
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resume })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `${resume.full_name}_Resume.pdf`;
link.click();
```

## Known Constraints

- **Turbopack**: Always use `--turbopack` flag with dev/build (configured in package.json)
- **React 19**: This project uses React 19 canary - some libraries may have compatibility issues
- **@react-pdf/renderer**: Server-only, cannot use browser APIs (DOM, window, etc.)
- **No TypeScript in API routes**: Use runtime validation for request bodies
- **Supabase RLS**: Row Level Security policies must be configured in Supabase dashboard

## Debugging Tips

### Supabase Auth Issues:
1. Check you're using correct client (server vs client vs middleware)
2. Verify environment variables are set
3. Check browser cookies (Supabase stores session in cookies)
4. Look for middleware errors in server logs

### AI Generation Failures:
1. Verify API keys in `.env.local`
2. Check API route logs: `console.error` statements in route files
3. Test with alternative model (switch between Gemini and OpenRouter)
4. Check prompt length limits

### PDF Generation Issues:
1. PDF templates must be React components using `@react-pdf/renderer`
2. No browser APIs allowed in templates
3. Check template_id mapping in `/api/generate-pdf/route.ts`
4. Verify resume data structure matches template expectations

### Type Errors:
1. Resume structure changed? Update `src/types/resume.ts`
2. Missing fields in form? Check database schema matches types
3. JSONB fields (education, skills, etc.) must be arrays, not null
