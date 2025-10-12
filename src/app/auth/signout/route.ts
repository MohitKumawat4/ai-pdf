import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Sign Out Route Handler
 * Handles user logout and session cleanup
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to home page
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  });
}
