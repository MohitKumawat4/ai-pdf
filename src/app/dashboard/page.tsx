import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, LogOut } from "lucide-react";
import Link from "next/link";

/**
 * Dashboard Page Component
 * Protected route - requires authentication
 * Displays user's resumes and account information
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

  return (
    <div className="min-h-screen">
      {/* Dashboard Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">ResumeAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.user_metadata?.full_name || "User"}!
          </h1>
          <p className="text-muted-foreground">
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/resume/create">
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Create New Resume</CardTitle>
                <CardDescription>
                  Start building a new resume from scratch
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle>My Resumes</CardTitle>
              <CardDescription>
                View and edit your existing resumes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Browse professional resume templates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Resumes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Resumes</h2>
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first resume to get started
              </p>
              <Link href="/resume/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
