"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BorderBeam } from "@/components/ui/border-beam";
import { getResumeById, updateResume } from "@/lib/supabase/resume-service";
import type { Resume } from "@/types/resume";
import {
  LayoutTemplate,
  Sparkles,
  Palette,
  ArrowLeft,
  Loader2,
  Eye,
  Orbit
} from "lucide-react";

interface TemplateOption {
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
  accentClass: string;
  previewClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "classic",
    name: "Classic Noir",
    tagline: "Timeless two-column layout with strong typography.",
    highlights: ["Clean sections", "Bold headings", "Excellent readability"],
    accentClass: "bg-black text-white",
    previewClass: "bg-gradient-to-br from-zinc-900 via-black to-zinc-800",
    icon: LayoutTemplate,
  },
  {
    id: "modern",
    name: "Modern Spotlight",
    tagline: "Hero banner with spotlight profile section.",
    highlights: ["Gradient header", "Profile focus", "Side-by-side columns"],
    accentClass: "bg-gradient-to-r from-emerald-500 to-sky-500 text-white",
    previewClass: "bg-gradient-to-br from-emerald-500 via-sky-600 to-indigo-600",
    icon: Sparkles,
  },
  {
    id: "minimal",
    name: "Minimal Aerial",
    tagline: "Whitespace driven aesthetic with airy spacing.",
    highlights: ["Single column", "Soft accents", "Scannable timeline"],
    accentClass: "bg-gradient-to-r from-zinc-200 to-zinc-50 text-black",
    previewClass: "bg-gradient-to-br from-white via-zinc-100 to-zinc-200",
    icon: Eye,
  },
  {
    id: "elegant",
    name: "Elegant Aurora",
    tagline: "Vertical sidebar with color-accented tags.",
    highlights: ["Left rail sidebar", "Tag callouts", "Aurora gradients"],
    accentClass: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-orange-400 text-white",
    previewClass: "bg-gradient-to-br from-purple-500 via-fuchsia-500 to-orange-400",
    icon: Palette,
  },
];

export default function ResumeTemplateSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);
  const [backNavigating, setBackNavigating] = useState(false);
  const [previewNavigating, setPreviewNavigating] = useState(false);

  useEffect(() => {
    // Fetch latest resume data so we can show current template selection
    const loadResume = async () => {
      try {
        const id = params.id as string;
        const data = await getResumeById(id);
        setResume(data);
      } catch (err) {
        console.error("Error loading resume for template selection:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume templates");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [params.id]);

  const handleTemplateSelection = async (templateId: string) => {
    if (!resume) return;
    if (resume.template_id === templateId) {
      router.push(`/resume/${resume.id}/preview`);
      return;
    }

    try {
      setSavingTemplateId(templateId);
      const updated = await updateResume(resume.id, { template_id: templateId });
      setResume(updated);
      router.push(`/resume/${resume.id}/preview`);
    } catch (err) {
      console.error("Error updating resume template:", err);
      setError(err instanceof Error ? err.message : "Unable to update template. Please retry.");
    } finally {
      setSavingTemplateId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error || "Resume not found."}</p>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-10 text-white">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-10">
          <BorderBeam className="opacity-80" size={220} colorFrom="#6366f1" colorTo="#a855f7" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60">
                <Orbit className="h-4 w-4" />
                <span>Template Studio</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold">Craft the look that amplifies your story</h1>
                <p className="mt-2 max-w-xl text-sm text-white/60">
                  Each template is tuned for clarity, contrast, and ATS-friendly structure. Switch designs without losing your content.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Gradient-ready backgrounds
                </span>
                <span className="flex items-center gap-1">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  Seamless PDF export
                </span>
              </div>
            </div>
            <div className="flex gap-3 self-start md:self-center">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 border border-white/10 bg-white/5 text-white hover:bg-white/10"
                disabled={backNavigating}
                onClick={() => {
                  if (backNavigating) return;
                  setBackNavigating(true);
                  router.push(`/resume/${resume.id}`);
                }}
              >
                {backNavigating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Returning...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Resume
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-white/20 bg-black text-white hover:bg-white/10"
                disabled={previewNavigating}
                onClick={() => {
                  if (previewNavigating) return;
                  setPreviewNavigating(true);
                  router.push(`/resume/${resume.id}/preview`);
                }}
              >
                {previewNavigating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening Preview...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview Current
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 text-xs text-white/40 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-white">4 curated formats</p>
              <p>Handpicked to balance density and whitespace.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-white">Instant preview</p>
              <p>See changes in the A4 preview in one click.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-white">Profile ready</p>
              <p>Support for optional profile imagery and accents.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-white">Theme aligned</p>
              <p>Dark UI crafted to match the builder shell.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {TEMPLATE_OPTIONS.map((template) => {
            const Icon = template.icon;
            const isActive = resume.template_id ? resume.template_id === template.id : template.id === "classic";

            return (
              <Card key={template.id} className="group relative overflow-hidden border border-white/10 bg-[#0c0c0c] text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] transition hover:border-white/25">
                <BorderBeam
                  className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  size={180}
                  colorFrom="#22d3ee"
                  colorTo="#6366f1"
                  delay={Math.random() * 6}
                />
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 ${template.accentClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl text-white">
                        {template.name}
                        {isActive && (
                          <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm text-white/60">
                        {template.tagline}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`relative h-28 w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${template.previewClass}`}>
                    <div className="absolute inset-x-6 top-6 h-3 rounded-full bg-white/70" />
                    <div className="absolute left-6 top-14 h-3 w-40 rounded-full bg-white/30" />
                    <div className="absolute right-6 top-14 h-3 w-16 rounded-full bg-white/20" />
                    <div className="absolute left-6 top-[88px] h-3 w-52 rounded-full bg-white/25" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {template.highlights.map((point) => (
                      <Badge
                        key={point}
                        variant="outline"
                        className="border border-white/20 bg-white/5 text-xs text-white/70 backdrop-blur"
                      >
                        {point}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <p>{isActive ? "Currently applied" : "Switch instantly—content stays intact"}</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => {
                          if (previewNavigating) return;
                          setPreviewNavigating(true);
                          router.push(`/resume/${resume.id}/preview`);
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-white text-black hover:bg-white/90"
                        disabled={!!savingTemplateId && savingTemplateId !== template.id}
                        onClick={() => handleTemplateSelection(template.id)}
                      >
                        {savingTemplateId === template.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Applying
                          </span>
                        ) : isActive ? (
                          "Using"
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
