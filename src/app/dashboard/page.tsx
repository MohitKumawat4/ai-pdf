import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";

type ResumeSummary = {
  id: string;
  title: string;
  updated_at: string;
  template_id: string | null;
  is_active: boolean;
};

/**
 * @route /dashboard
 * @description Main dashboard page - Protected route requiring authentication
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Fetch all resumes for the authenticated user
  const { data: resumesData, error: resumesError } = await supabase
    .from("resumes")
    .select("id, title, updated_at, template_id, is_active")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const resumes: ResumeSummary[] = (resumesData ?? []) as ResumeSummary[];

  return (
    <DashboardContent
      user={user}
      resumes={resumes}
      resumesError={!!resumesError}
    />
  );
}

