# Environment Setup Instructions

## Supabase Configuration

Create a `.env.local` file in the project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nlgxlzrxqbmacisufluu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZ3hsenJ4cWJtYWNpc3VmbHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDQ3MDUsImV4cCI6MjA3NTY4MDcwNX0.pqp_TJZokPJ_S3K7iDNN0KggtY2BpDJdbtAGSOF1L2s
```

## Project Information

- **Project Name**: ai-pdf
- **Project ID**: nlgxlzrxqbmacisufluu
- **Region**: ap-south-1 (Mumbai)
- **Project URL**: https://nlgxlzrxqbmacisufluu.supabase.co

## How to Get Your Keys (Alternative Method)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/nlgxlzrxqbmacisufluu
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy the `URL` and `anon` `public` key
5. Paste them in your `.env.local` file

## After Adding the Keys

Restart your development server:
```bash
npm run dev
```
