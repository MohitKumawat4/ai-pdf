import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SavedResumesContent } from "./saved-resumes-content";

type ResumeSummary = {
  id: string;
  title: string;
  updated_at: string;
  template_id: string | null;
  is_active: boolean;
};

/**
 * @route /saved-resumes
 * @description Saved resumes page - Displays all saved resumes for authenticated user
 */
export default async function SavedResumesPage() {
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

  // Server action to delete a resume
  const deleteResumeAction = async (formData: FormData) => {
    "use server";

    const resumeId = formData.get("resumeId");
    if (!resumeId || typeof resumeId !== "string") {
      return;
    }

    const supabaseClient = await createClient();
    const {
      data: { user: currentUser },
    } = await supabaseClient.auth.getUser();

    if (!currentUser) {
      redirect("/login");
    }

    await supabaseClient
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", currentUser.id);

    revalidatePath("/saved-resumes");
  };

  return (
    <SavedResumesContent
      user={user}
      resumes={resumes}
      resumesError={!!resumesError}
      deleteResumeAction={deleteResumeAction}
    />
  );
}
