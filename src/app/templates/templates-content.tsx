import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { FileText, LogOut, ArrowLeft, Sparkles, FileDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type TemplatesContentProps = {
  user: {
    email?: string;
  };
};

// Template metadata
const templates = [
  {
    id: "classic",
    name: "Classic Noir",
    subtitle: "Monochrome",
    description: "Timeless two-column layout with strong typography and clean sections.",
    previewImage: "/templates-preview/Classic Noir.png",
    recommended: true,
  },
  {
    id: "modern",
    name: "Modern Spotlight",
    subtitle: "Gradient",
    description: "Hero banner with spotlight profile section and side-by-side columns.",
    previewImage: "/templates-preview/Morden Spotlight.png",
    recommended: false,
  },
  {
    id: "minimal",
    name: "Minimal Aerial",
    subtitle: "Monochrome",
    description: "Whitespace-driven single column design with airy spacing for clean focus.",
    previewImage: "/templates-preview/Minimal Aerial.png",
    recommended: false,
  },
  {
    id: "emerald",
    name: "Emerald Advisor",
    subtitle: "Professional",
    description: "Finance-ready elegance with refined single-column layout and section accents.",
    previewImage: "/templates-preview/Emrald Advisor.png",
    recommended: false,
  },
  {
    id: "elegant",
    name: "Elegant Aurora",
    subtitle: "Colorful",
    description: "Vertical sidebar with vibrant aurora gradients and color-accented tags.",
    previewImage: "/templates-preview/Eligant Aurora.png",
    recommended: false,
  },
  {
    id: "slate",
    name: "Slate Horizon",
    subtitle: "Monochrome",
    description: "Structured card-based sections with muted slate tones and high contrast.",
    previewImage: "/templates-preview/Slate Horizon.png",
    recommended: false,
  },
];

/**
 * Templates Content Component
 * Displays all available resume templates
 */
export function TemplatesContent({ user }: TemplatesContentProps) {
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
        <div className="mb-12 space-y-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="group hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              Resume Templates
            </h1>
            <p className="text-xl text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Choose from our collection of professionally designed templates
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <Link key={template.id} href="/resume/create" className="block">
              <Card
                className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 cursor-pointer h-full shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
                style={{animationDelay: `${index * 100}ms`, animationDuration: '700ms'}}
              >
                <BorderBeam size={200} duration={15} delay={index * 2} colorFrom="#06b6d4" colorTo="#a855f7" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {/* Template Preview */}
              <div className="relative aspect-[8.5/11] overflow-hidden bg-white rounded-t-xl ring-1 ring-white/10 group-hover:ring-cyan-400/30 transition-all duration-500">
                {/* Real Template Image */}
                <Image
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Button 
                    className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50"
                    size="lg"
                  >
                    Use this template
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <CardContent className="relative p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{template.name}</h3>
                      {template.recommended && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 border-yellow-500/40 text-xs animate-pulse shadow-lg shadow-yellow-500/20">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{template.description}</p>
                  </div>
                </div>
                
                {/* Format Badges */}
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30 text-cyan-300 text-xs">
                    PDF
                  </Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30 text-purple-300 text-xs">
                    DOCX
                  </Badge>
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Card */}
        <Card className="group relative mt-12 overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <BorderBeam size={250} duration={15} delay={0} colorFrom="#06b6d4" colorTo="#a855f7" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <CardContent className="relative p-8">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50">
                <FileText className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-400 blur-xl opacity-50" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                  Switch Templates Anytime
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  You can change your resume template at any time from the preview page. Your content stays the same, only the design changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
