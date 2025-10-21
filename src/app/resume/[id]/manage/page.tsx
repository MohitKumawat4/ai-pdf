"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  FileText,
  Edit,
  Eye,
  LayoutTemplate,
  Trash2,
  ArrowLeft,
  Loader2,
  Calendar,
  Download
} from "lucide-react";
import { getResumeById } from "@/lib/supabase/resume-service";
import { createClient } from "@/lib/supabase/client";
import type { Resume } from "@/types/resume";
import Image from "next/image";

/**
 * @route /resume/[id]/manage
 * @description Resume Management Page - Central hub for all resume actions
 */
export default function ResumeManagePage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const id = params.id as string;
        const data = await getResumeById(id);
        setResume(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id]);

  const handleDelete = async () => {
    if (!resume) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeleting(true);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (deleteError) throw deleteError;

      // Navigate back to saved resumes
      router.push("/saved-resumes");
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-white/10 bg-black/40 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Resume Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The resume you're looking for doesn't exist."}
            </p>
            <Link href="/saved-resumes">
              <Button>Back to Saved Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/saved-resumes">
          <Button variant="ghost" size="sm" className="group mb-6 hover:bg-white/10 transition-all duration-300">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Saved Resumes
          </Button>
        </Link>

        {/* Resume Header */}
        <div className="mb-12 space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              {resume.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300">
                {resume.template_id ? resume.template_id.charAt(0).toUpperCase() + resume.template_id.slice(1) : "Classic"} Template
              </Badge>
              <Badge 
                variant={resume.is_active ? "default" : "secondary"}
                className={resume.is_active ? "bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 border-emerald-500/40 animate-pulse shadow-lg shadow-emerald-500/20" : "bg-white/10 border border-white/20 text-white/70"}
              >
                {resume.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Quick Info */}
          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl shadow-xl shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <BorderBeam size={200} duration={15} delay={0} colorFrom="#06b6d4" colorTo="#a855f7" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardContent className="relative p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Full Name</p>
                  <p className="font-semibold text-white text-lg">{resume.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Email</p>
                  <p className="font-semibold text-white text-lg">{resume.email}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Phone</p>
                  <p className="font-semibold text-white text-lg">{resume.contact_number}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Location</p>
                  <p className="font-semibold text-white text-lg">{resume.address || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* View Details */}
          <Link href={`/resume/${resume.id}`}>
            <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <BorderBeam size={200} duration={15} delay={0} colorFrom="#06b6d4" colorTo="#3b82f6" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative h-14 w-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-cyan-500/50">
                    <FileText className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">View Details</CardTitle>
                    <CardDescription className="text-zinc-400">See all resume information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  View your complete resume with all sections, experience, education, and skills.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Preview Template */}
          <Link href={`/resume/${resume.id}/preview`}>
            <Card className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <BorderBeam size={200} duration={15} delay={2} colorFrom="#a855f7" colorTo="#ec4899" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/50">
                    <Eye className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Preview</CardTitle>
                    <CardDescription className="text-zinc-400">See formatted resume</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Preview your resume in the selected template format and download as PDF.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Change Template */}
          <Link href={`/resume/${resume.id}/templates`}>
            <Card className="group relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
              <BorderBeam size={200} duration={15} delay={4} colorFrom="#10b981" colorTo="#06b6d4" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative h-14 w-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/50">
                    <LayoutTemplate className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Change Template</CardTitle>
                    <CardDescription className="text-zinc-400">Switch resume design</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Choose from 6 professional templates to change your resume&apos;s appearance.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Edit Resume */}
          <Link href={`/resume/create?resumeId=${resume.id}`}>
            <Card className="group relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-orange-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-orange-500/10 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <BorderBeam size={200} duration={15} delay={6} colorFrom="#f97316" colorTo="#eab308" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative h-14 w-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-orange-500/50">
                    <Edit className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Edit Details</CardTitle>
                    <CardDescription className="text-zinc-400">Update resume content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Edit your resume information, add new experiences, or update existing details.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Danger Zone */}
        <Card className="group relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/10 backdrop-blur-xl shadow-xl shadow-red-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
          <BorderBeam size={200} duration={15} delay={8} colorFrom="#ef4444" colorTo="#dc2626" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <CardHeader className="relative">
            <CardTitle className="text-xl font-bold text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-red-300/70">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">Delete this resume</p>
                <p className="text-sm text-muted-foreground">
                  Once deleted, this resume cannot be recovered.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
