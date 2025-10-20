import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplatesContent } from "./templates-content";

/**
 * @route /templates
 * @description Templates browse page - Displays all available resume templates
 */
export default async function TemplatesPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return <TemplatesContent user={user} />;
}
