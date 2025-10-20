import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { FileText, Plus, LogOut, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ResumeSummary = {
  id: string;
  title: string;
  updated_at: string;
  template_id: string | null;
  is_active: boolean;
};

type SavedResumesContentProps = {
  user: {
    email?: string;
  };
  resumes: ResumeSummary[];
  resumesError: boolean;
  deleteResumeAction: (formData: FormData) => Promise<void>;
};

/**
 * Saved Resumes Content Component
 * Displays all saved resumes with management actions
 */
export function SavedResumesContent({
  user,
  resumes,
  resumesError,
  deleteResumeAction,
}: SavedResumesContentProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
      {/* Navigation */}
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

      {/* Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="group hover:bg-white/10 transition-all duration-300">
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
                Saved Resumes
              </h1>
              <p className="text-xl text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                All your saved resumes in one place
              </p>
            </div>
          </div>
          <Link href="/resume/create" className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {resumesError && (
          <Card className="relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-200 backdrop-blur-xl shadow-xl shadow-red-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BorderBeam size={200} duration={15} colorFrom="#ef4444" colorTo="#dc2626" />
            <CardContent className="relative p-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p>Unable to load your resumes right now. Please refresh the page.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {resumes.length === 0 && !resumesError && (
          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BorderBeam size={250} duration={15} colorFrom="#06b6d4" colorTo="#a855f7" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardContent className="relative p-16 text-center">
              <div className="relative inline-block mb-6">
                <FileText className="h-20 w-20 mx-auto text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-2xl" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">No resumes saved yet</h3>
              <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
                Save a resume from the preview screen and it will appear here.
              </p>
              <Link href="/resume/create">
                <Button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300" size="lg">
                  <Plus className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" />
                  Create Your First Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Resume Grid */}
        {!resumesError && resumes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, index) => (
              <ResumeSummaryCard
                key={resume.id}
                resume={resume}
                deleteAction={deleteResumeAction}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Resume card component - Now fully clickable
function ResumeSummaryCard({
  resume,
  deleteAction,
  index,
}: {
  resume: ResumeSummary;
  deleteAction: (formData: FormData) => Promise<void>;
  index: number;
}) {
  return (
    <Link href={`/resume/${resume.id}/manage`} className="block h-full">
      <Card 
        className="group relative h-full overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 cursor-pointer shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
        style={{animationDelay: `${index * 100}ms`, animationDuration: '700ms'}}
      >
        <BorderBeam size={200} duration={15} delay={index * 2} colorFrom="#06b6d4" colorTo="#a855f7" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {resume.title}
              </h3>
              <p className="text-sm text-zinc-400">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Template: {resume.template_id ? resume.template_id.charAt(0).toUpperCase() + resume.template_id.slice(1) : "Classic"}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className={`shrink-0 ${
                resume.is_active 
                  ? "bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 border-emerald-500/40 animate-pulse shadow-lg shadow-emerald-500/20" 
                  : "bg-white/10 border border-white/20 text-white/70"
              }`}
            >
              {resume.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-zinc-400 mt-6 pt-4 border-t border-white/10">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span className="group-hover:text-cyan-300 transition-colors">Click to manage this resume</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
