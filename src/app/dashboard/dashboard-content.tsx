import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, LogOut, LayoutTemplate, Sparkles, TrendingUp, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";
// import { Particles } from "@/components/ui/particles";
import Image from "next/image";

type ResumeSummary = {
  id: string;
  title: string;
  updated_at: string;
  template_id: string | null;
  is_active: boolean;
};

type DashboardContentProps = {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  resumes: ResumeSummary[];
  resumesError: boolean;
};

/**
 * Dashboard Content Component
 * Main content area for the dashboard page
 */
export function DashboardContent({ user, resumes, resumesError }: DashboardContentProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
      {/* Dashboard Navigation */}
      <nav className="relative z-10 border-b border-cyan-500/20 bg-black/40 backdrop-blur-2xl shadow-lg shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <Image src="/logo.png" alt="ResumePersona" width={32} height={32} className="h-8 w-8 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">ResumePersona</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit" className="hover:bg-white/10 hover:text-white transition-all duration-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-3">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              Welcome back, {user.user_metadata?.full_name || "User"}!
            </h1>
            <p className="text-xl text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Your career journey starts here. Let's build something amazing.
            </p>
          </div>
          
          {/* Inspirational Quote Card */}
          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <BorderBeam size={250} duration={15} delay={0} colorFrom="#06b6d4" colorTo="#a855f7" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardContent className="relative p-8">
              <div className="flex items-start gap-6">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50">
                  <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-400 blur-xl opacity-50" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xl font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 leading-relaxed">
                    "Your resume is not just a document—it's your story, your achievements, and your future."
                  </p>
                  <p className="text-sm text-zinc-400">Make every word count.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Zap className="h-7 w-7 text-yellow-400 animate-pulse" />
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Quick Actions</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/resume/create">
            <Card className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
              <BorderBeam size={180} duration={15} delay={0} colorFrom="#a855f7" colorTo="#ec4899" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative p-8">
                <div className="relative h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/50">
                  <Plus className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-2xl mb-3 font-bold text-white">Create New Resume</CardTitle>
                <CardDescription className="text-base text-zinc-400 leading-relaxed">
                  Start building a new resume from scratch with our AI-powered tools
                </CardDescription>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Get started in minutes</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/saved-resumes">
            <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">
              <BorderBeam size={180} duration={15} delay={5} colorFrom="#06b6d4" colorTo="#3b82f6" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative p-8">
                <div className="relative h-20 w-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-cyan-500/50">
                  <FileText className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-400 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-2xl mb-3 font-bold text-white">My Resumes</CardTitle>
                <CardDescription className="text-base text-zinc-400 leading-relaxed">
                  View and manage all your saved resumes in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                {!resumesError && resumes.length > 0 && (
                  <div className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 backdrop-blur-sm">
                    <div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">{resumes.length} Resume{resumes.length !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-zinc-400">Click to view all</p>
                    </div>
                    <div className="relative">
                      <FileText className="h-12 w-12 text-cyan-400" />
                      <div className="absolute inset-0 bg-cyan-400/30 blur-xl" />
                    </div>
                  </div>
                )}
                {!resumesError && resumes.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-500/5 p-8 text-center">
                    <FileText className="h-14 w-14 text-cyan-400/50" />
                    <div>
                      <p className="text-sm font-semibold text-white">No resumes saved yet</p>
                      <p className="text-xs text-zinc-400">Save a resume from the preview screen</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end mt-4">
                  <ArrowRight className="h-5 w-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="group relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02]">
              <BorderBeam size={180} duration={15} delay={10} colorFrom="#10b981" colorTo="#06b6d4" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative p-8">
                <div className="relative h-20 w-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/50">
                  <LayoutTemplate className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-400 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <CardTitle className="text-2xl mb-3 font-bold text-white">Templates</CardTitle>
                <CardDescription className="text-base text-zinc-400 leading-relaxed">
                  Browse professional resume templates designed by experts
                </CardDescription>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles className="h-4 w-4" />
                    <span>6 premium templates available</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
          </div>
        </div>

        {/* Stats/Tips Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">💡</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pro Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-zinc-300 leading-relaxed">
                Tailor your resume for each job application. Use keywords from the job description to increase your chances of passing ATS systems.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                  <span className="text-sm text-zinc-300 font-medium">Total Resumes</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{resumes.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <span className="text-sm text-zinc-300 font-medium">Templates Available</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
