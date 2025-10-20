"use client";

import { useEffect, useState, useRef, cloneElement, isValidElement } from "react";
import type { Ref, ReactElement, CSSProperties, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Loader2, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getResumeById, updateResume } from "@/lib/supabase/resume-service";
import type { Resume } from "@/types/resume";
import { PDFDownloadButton } from "@/components/pdf-download-button";
import { Download1Button } from "@/components/download1-button";
import Image from "next/image";
// import { DotPattern } from "@/components/ui/dot-pattern";
// import { ShimmerButton } from "@/components/ui/shimmer-button";

// Template quick select metadata used in the preview sidebar.
const TEMPLATE_QUICK_OPTIONS = [
  {
    id: "classic",
    name: "Classic Noir",
    summary: "Timeless two-column clarity.",
    accentClass: "from-zinc-900 via-zinc-700 to-zinc-500",
    previewImage: "/templates-preview/Classic Noir.png",
  },
  {
    id: "modern",
    name: "Modern Spotlight",
    summary: "Hero banner with spotlight details.",
    accentClass: "from-slate-900 via-slate-700 to-gray-500",
    previewImage: "/templates-preview/Morden Spotlight.png",
  },
  {
    id: "minimal",
    name: "Minimal Aerial",
    summary: "Whitespace driven single column.",
    accentClass: "from-zinc-200 via-zinc-100 to-white",
    previewImage: "/templates-preview/Minimal Aerial.png",
  },
  {
    id: "emerald",
    name: "Emerald Advisor",
    summary: "Finance-ready elegance.",
    accentClass: "from-emerald-700 via-emerald-500 to-emerald-300",
    previewImage: "/templates-preview/Emrald Advisor.png",
  },
  {
    id: "elegant",
    name: "Elegant Aurora",
    summary: "Aurora sidebar with accents.",
    accentClass: "from-purple-600 via-fuchsia-500 to-orange-400",
    previewImage: "/templates-preview/Eligant Aurora.png",
  },
  {
    id: "slate",
    name: "Slate Horizon",
    summary: "Professional muted tones.",
    accentClass: "from-slate-700 via-slate-500 to-slate-300",
    previewImage: "/templates-preview/Slate Horizon.png",
  },
];

interface PreviewStyleSettings {
  fontFamily: string;
  accentColor: string;
  pageBackground: string;
  textColor: string;
}

interface ThemePreset extends PreviewStyleSettings {
  name: string;
  description: string;
  accentStrength?: number;
}

type CSSWithVars = CSSProperties & Record<string, string | number | undefined>;

const FONT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Sora", value: "'Sora', sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
];

const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Noir",
    description: "Classic monochrome with refined contrast.",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: "#111827",
    pageBackground: "#ffffff",
    textColor: "#0f172a",
    accentStrength: 70,
  },
  {
    name: "Skyline",
    description: "Cool blues with soft gradients.",
    fontFamily: "'Space Grotesk', sans-serif",
    accentColor: "#2563eb",
    pageBackground: "#f8fafc",
    textColor: "#1f2937",
    accentStrength: 60,
  },
  {
    name: "Editorial",
    description: "Serif elegance and lilac highlights.",
    fontFamily: "'Playfair Display', serif",
    accentColor: "#9333ea",
    pageBackground: "#fdf4ff",
    textColor: "#3b0764",
    accentStrength: 65,
  },
  {
    name: "Verdant",
    description: "Fresh teal inspired by modern SaaS dashboards.",
    fontFamily: "'Sora', sans-serif",
    accentColor: "#0f766e",
    pageBackground: "#ecfdf5",
    textColor: "#134e4a",
    accentStrength: 75,
  },
];

/**
 * Resume Preview Page
 * Shows A4-sized preview with working hyperlinks
 * Allows PDF download
 */

export default function ResumePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [templateSwitchingId, setTemplateSwitchingId] = useState<string | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [styleSettings, setStyleSettings] = useState<PreviewStyleSettings>(THEME_PRESETS[0]);
  const [accentStrength, setAccentStrength] = useState(70);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Apply preset styling options to the preview.
  const applyPreset = (preset: ThemePreset) => {
    setStyleSettings({
      fontFamily: preset.fontFamily,
      accentColor: preset.accentColor,
      pageBackground: preset.pageBackground,
      textColor: preset.textColor,
    });

    if (typeof preset.accentStrength === "number") {
      setAccentStrength(preset.accentStrength);
    }
  };

  const handleFontChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setStyleSettings((prev) => ({
      ...prev,
      fontFamily: value,
    }));
  };

  const handleColorChange = (key: keyof PreviewStyleSettings) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStyleSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAccentStrengthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccentStrength(Number(event.target.value));
  };

  // Memoized helpers for contact and social links reused across templates
  const renderContactLinks = (resumeData: Resume) => (
    <>
      {resumeData.email && (
        <a
          href={`mailto:${resumeData.email}`}
          className="hover:text-black hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {resumeData.email}
        </a>
      )}
      {resumeData.contact_number && (
        <a
          href={`tel:${resumeData.contact_number}`}
          className="hover:text-black hover:underline"
        >
          {resumeData.contact_number}
        </a>
      )}
      {resumeData.address && <span>{resumeData.address}</span>}
    </>
  );

  const renderSocialLinks = (resumeData: Resume) => (
    <>
      {resumeData.linkedin_url && (
        <a
          href={resumeData.linkedin_url}
          className="hover:text-black hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      )}
      {resumeData.github_url && (
        <a
          href={resumeData.github_url}
          className="hover:text-black hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      )}
      {resumeData.portfolio_url && (
        <a
          href={resumeData.portfolio_url}
          className="hover:text-black hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>
      )}
    </>
  );

  const renderProfessionalSummary = (resumeData: Resume) => (
    resumeData.professional_summary && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-black uppercase tracking-wide">
          Professional Summary
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          {resumeData.professional_summary}
        </p>
      </div>
    )
  );

  const renderEducation = (resumeData: Resume) => (
    resumeData.education && resumeData.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
          Education
        </h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-black">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
              </div>
              <div className="text-sm text-gray-600 text-right">
                {edu.start_date && (
                  <span>
                    {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {edu.end_date && ` - ${new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </span>
                )}
              </div>
            </div>
            {edu.gpa && (
              <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
            )}
            {edu.description && (
              <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    )
  );

  const renderSkills = (resumeData: Resume) => (
    resumeData.skills && resumeData.skills.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
          Skills
        </h2>
        {Array.isArray(resumeData.skills) && typeof resumeData.skills[0] === 'object' && 'category' in resumeData.skills[0] ? (
          <div className="space-y-2">
            {(resumeData.skills as { category: string; skills: string[] }[]).map((skillCat, index) => (
              <div key={index}>
                <span className="font-semibold text-sm text-black">{skillCat.category}: </span>
                <span className="text-sm text-gray-700">{skillCat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            {(resumeData.skills as string[]).join(', ')}
          </div>
        )}
      </div>
    )
  );

  const renderExperience = (resumeData: Resume) => (
    resumeData.experience && resumeData.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
          Work Experience
        </h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-black">{exp.position}</h3>
                <p className="text-sm text-gray-700">{exp.company}</p>
              </div>
              <div className="text-sm text-gray-600 text-right">
                {exp.start_date && (
                  <span>
                    {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {exp.end_date ? ` - ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' - Present'}
                  </span>
                )}
              </div>
            </div>
            {exp.description && (
              <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {exp.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );

  const renderProjects = (resumeData: Resume) => (
    resumeData.projects && resumeData.projects.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
          Projects
        </h2>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base text-black">
                {project.url ? (
                  <a
                    href={project.url}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              {project.start_date && (
                <span className="text-sm text-gray-600">
                  {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            {project.technologies && project.technologies.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Tech: {project.technologies.join(', ')}
              </p>
            )}
            {project.description && (
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
            )}
            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc pl-4">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )
  );

  const renderAdditionalSections = (
    resumeData: Resume,
    options?: { exclude?: Array<'awards' | 'certificates' | 'hobbies' | 'languages'> }
  ) => {
    const excluded = new Set(options?.exclude ?? []);

    return (
      <>
      {!excluded.has('awards') && resumeData.awards && resumeData.awards.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">Awards</h2>
          {resumeData.awards.map((award, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-semibold text-sm text-black">{award.title}</h3>
                <span className="text-sm text-gray-600">
                  {new Date(award.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{award.issuer}</p>
              {award.description && (
                <p className="text-sm text-gray-600 mt-1">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!excluded.has('certificates') && resumeData.certificates && resumeData.certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">Certificates</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {resumeData.certificates.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {!excluded.has('hobbies') && resumeData.hobbies && resumeData.hobbies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">Hobbies & Interests</h2>
          <p className="text-sm text-gray-700">{resumeData.hobbies.join(', ')}</p>
        </div>
      )}

      {!excluded.has('languages') && resumeData.communication_languages && resumeData.communication_languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">Languages</h2>
          <p className="text-sm text-gray-700">{resumeData.communication_languages.join(', ')}</p>
        </div>
      )}
    </>
    );
  };

  const renderClassicTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => (
    <div
      ref={templateRef}
      className="w-[210mm] min-h-[297mm] bg-white p-[15mm] print:p-0"
      data-pdf-content
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-black flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-black">{resumeData.full_name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {renderContactLinks(resumeData)}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mt-1">
            {renderSocialLinks(resumeData)}
          </div>
        </div>
        {resumeData.profile_picture && (
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resumeData.profile_picture}
              alt={`${resumeData.full_name} avatar`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {renderProfessionalSummary(resumeData)}
      {renderEducation(resumeData)}
      {renderSkills(resumeData)}
      {renderExperience(resumeData)}
      {renderProjects(resumeData)}
      {renderAdditionalSections(resumeData)}
    </div>
  );

  const renderSlateTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => {
    // Helper to safely format month/year for date ranges.
    const formatRange = (start?: string, end?: string, current?: boolean) => {
      const toLabel = (value?: string) =>
        value ? new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

      const startLabel = toLabel(start);
      const endLabel = current ? 'Present' : toLabel(end);

      if (!startLabel && !endLabel) {
        return '';
      }

      return `${startLabel}${startLabel && endLabel ? ' - ' : ''}${endLabel}`;
    };

    // Shared section shell so each block matches the slate theme aesthetic.
    const slateSection = (title: string, content: ReactElement | null) =>
      content && (
        <section className="overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">
          <div className="bg-[#dfe3ea] px-5 py-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-[#384057]">{title}</h2>
          </div>
          <div className="px-6 py-4 text-[#2b2f38] text-sm leading-relaxed">{content}</div>
        </section>
      );

    return (
      <div
        ref={templateRef}
        className="w-[210mm] min-h-[297mm] bg-[#f5f7fb] p-[18mm] print:p-0"
        data-pdf-content
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: '#f5f7fb',
          color: '#2b2f38',
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <header className="rounded-xl bg-white px-10 py-8 text-center shadow-sm border border-[#dfe3ea]">
            <h1 className="text-4xl font-semibold tracking-tight text-[#2f3645]">
              {resumeData.full_name || 'Your Name'}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#7c859a]">
              {resumeData.professional_summary ? 'Professional Summary' : 'Entry-Level Resume'}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#4f5565]">
              {renderContactLinks(resumeData)}
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.28em] text-[#7c859a]">
              {renderSocialLinks(resumeData)}
            </div>
          </header>

          {/* Summary */}
          {slateSection(
            'Summary',
            resumeData.professional_summary ? (
              <p>{resumeData.professional_summary}</p>
            ) : (
              <p>
                Enthusiastic professional ready to contribute technical and interpersonal skills to your organization.
              </p>
            )
          )}

          {/* Education */}
          {slateSection(
            'Education',
            resumeData.education && resumeData.education.length > 0 ? (
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={`${edu.institution}-${index}`} className="space-y-1">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm font-semibold text-[#2f3645]">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ''}
                      </p>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#7c859a]">
                        {formatRange(edu.start_date, edu.end_date, edu.current)}
                      </span>
                    </div>
                    <p className="text-sm text-[#4f5565]">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</p>
                    {edu.gpa && <p className="text-sm text-[#4f5565]">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-sm text-[#4f5565]">{edu.description}</p>}
                  </div>
                ))}
              </div>
            ) : null
          )}

          {/* Experience */}
          {slateSection(
            'Relevant Experience',
            resumeData.experience && resumeData.experience.length > 0 ? (
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={`${exp.company}-${index}`} className="space-y-2">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm font-semibold text-[#2f3645]">
                        {exp.position} · {exp.company}
                      </p>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#7c859a]">
                        {formatRange(exp.start_date, exp.end_date, exp.current)}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#9aa3b8]">
                      {exp.location || 'Location'}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-[#4f5565]">
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5565]">
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <li key={`${exp.company}-achievement-${achievementIndex}`}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : null
          )}

          {/* Skills */}
          {slateSection(
            'Key Skills',
            resumeData.skills && resumeData.skills.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {(Array.isArray(resumeData.skills) && typeof resumeData.skills[0] === 'object' && 'category' in resumeData.skills[0]
                  ? (resumeData.skills as { category: string; skills: string[] }[]).flatMap((skillGroup) =>
                      skillGroup.skills.map((item) => ({ label: item }))
                    )
                  : (resumeData.skills as string[]).map((item) => ({ label: item }))
                ).map((skill, index) => (
                  <div key={`${skill.label}-${index}`} className="flex items-center gap-2 text-sm text-[#4f5565]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#919bb0]" aria-hidden />
                    {skill.label}
                  </div>
                ))}
              </div>
            ) : null
          )}

          {/* Additional sections */}
          {slateSection(
            'Hobbies & Interests',
            resumeData.hobbies && resumeData.hobbies.length > 0 ? (
              <p>{resumeData.hobbies.join(', ')}</p>
            ) : null
          )}

          {slateSection(
            'Languages',
            resumeData.communication_languages && resumeData.communication_languages.length > 0 ? (
              <p>{resumeData.communication_languages.join(', ')}</p>
            ) : null
          )}

          {slateSection(
            'Achievements',
            resumeData.achievements && resumeData.achievements.length > 0
              ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {resumeData.achievements.map((achievement, achievementIndex) => (
                      <li key={`achievement-${achievementIndex}`} className="text-sm text-[#4f5565]">
                        <span className="font-medium text-[#2f3645]">{achievement.title}</span>
                        {achievement.description ? ` – ${achievement.description}` : ''}
                      </li>
                    ))}
                  </ul>
                )
              : null
          )}
        </div>
      </div>
    );
  };

  const renderModernTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => (
    <div
      ref={templateRef}
      className="w-[210mm] min-h-[297mm] bg-white print:p-0"
      data-pdf-content
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      <div className="bg-gradient-to-r from-black via-zinc-800 to-black px-[15mm] py-[18mm] text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Modern Spotlight</p>
            <h1 className="mt-2 text-4xl font-semibold">{resumeData.full_name}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
              {renderContactLinks(resumeData)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {resumeData.profile_picture ? (
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white/40 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resumeData.profile_picture}
                  alt={`${resumeData.full_name} avatar`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-white/30 text-xs uppercase tracking-[0.3em] text-white/40">
                Photo
              </div>
            )}
            <div className="flex flex-col text-sm text-white/70">
              {renderSocialLinks(resumeData)}
            </div>
          </div>
        </div>
        <div className="mt-6 text-sm text-white/70">
          {resumeData.professional_summary || "Experienced professional seeking new opportunities."}
        </div>
      </div>

      <div className="grid gap-[15mm] px-[15mm] py-[18mm] md:grid-cols-[1.2fr_0.8fr]">
        <div>
          {renderExperience(resumeData)}
          {renderProjects(resumeData)}
        </div>
        <div className="space-y-6">
          {renderEducation(resumeData)}
          {renderSkills(resumeData)}
          {resumeData.communication_languages && resumeData.communication_languages.length > 0 && (
            <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 shadow-sm">
              <h2 className="text-base font-semibold tracking-wide text-black uppercase">Languages</h2>
              <p className="mt-2 text-sm text-gray-700">{resumeData.communication_languages.join(', ')}</p>
            </div>
          )}
          {resumeData.awards && resumeData.awards.length > 0 && (
            <div className="rounded-xl border border-black/10 bg-zinc-50 p-4 shadow-sm">
              <h2 className="text-base font-semibold tracking-wide text-black uppercase">Highlights</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {resumeData.awards.slice(0, 3).map((award, index) => (
                  <li key={index}>{award.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => (
    <div
      ref={templateRef}
      className="w-[210mm] min-h-[297mm] bg-white p-[20mm] print:p-0"
      data-pdf-content
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">{resumeData.full_name}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {renderContactLinks(resumeData)}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-wide text-gray-500">
            {renderSocialLinks(resumeData)}
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {resumeData.profile_picture && (
          <div className="flex justify-center">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-gray-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resumeData.profile_picture}
                alt={`${resumeData.full_name} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {renderProfessionalSummary(resumeData)}

        <div className="grid gap-12">
          {renderExperience(resumeData)}
          {renderProjects(resumeData)}
          {renderEducation(resumeData)}
          {renderSkills(resumeData)}
        </div>

        <Separator className="bg-gray-200" />

        <div className="grid gap-10 md:grid-cols-2">
          {resumeData.communication_languages && resumeData.communication_languages.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Languages</h2>
              <p className="mt-2 text-sm text-gray-700">{resumeData.communication_languages.join(', ')}</p>
            </div>
          )}
          {resumeData.hobbies && resumeData.hobbies.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Interests</h2>
              <p className="mt-2 text-sm text-gray-700">{resumeData.hobbies.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmeraldTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => {
    // Split multiline descriptions into bullet-friendly arrays for improved readability.
    const splitIntoBullets = (text?: string) =>
      text
        ? text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
        : [];

    const isSkillCategoryArray = (
      skills: Resume['skills']
    ): skills is { category: string; skills: string[] }[] =>
      Array.isArray(skills) &&
      skills.length > 0 &&
      typeof skills[0] === 'object' &&
      skills[0] !== null &&
      'category' in skills[0];

    const flattenedSkills =
      isSkillCategoryArray(resumeData.skills)
        ? resumeData.skills.flatMap((skillCat) => skillCat.skills)
        : Array.isArray(resumeData.skills)
          ? (resumeData.skills as string[])
          : [];

    const accentHeading = (title: string) => (
      <h2 className="text-lg font-semibold tracking-[0.28em] text-[#2b6750] uppercase">{title}</h2>
    );

    return (
      <div
        ref={templateRef}
        className="w-[210mm] min-h-[297mm] bg-[#f7f6f2] p-[22mm] print:p-0"
        data-pdf-content
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: '#f7f6f2',
          color: '#1f2933',
        }}
      >
        <div className="flex flex-col gap-8">
          <header className="text-center border-b border-[#d6cfc5] pb-6">
            <h1 className="text-4xl font-semibold tracking-[0.18em] text-[#2b6750] uppercase">
              {resumeData.full_name || 'Your Name'}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[#2d3436]">
              {resumeData.address && <span>{resumeData.address}</span>}
              {renderContactLinks(resumeData)}
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.22em] text-[#5f6f65]">
              {renderSocialLinks(resumeData)}
            </div>
          </header>

          {resumeData.professional_summary && (
            <section className="space-y-3">
              {accentHeading('Summary')}
              <p className="text-sm leading-relaxed text-[#2d3436]">
                {resumeData.professional_summary}
              </p>
            </section>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="space-y-5">
              {accentHeading('Professional Experience')}
              <div className="flex flex-col gap-5">
                {resumeData.experience.map((exp, index) => {
                  const bulletItems = [
                    ...splitIntoBullets(exp.description),
                    ...(exp.achievements ?? []),
                  ];

                  return (
                    <div key={`${exp.company}-${index}`} className="space-y-2">
                      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#2b6750] uppercase tracking-[0.18em]">
                            {exp.position || 'Role'}
                          </p>
                          <p className="text-sm italic text-[#1f2933]">
                            {exp.company}
                            {exp.location ? `, ${exp.location}` : ''}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-[#5f6f65] uppercase">
                          {exp.start_date
                            ? `${new Date(exp.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                            : ''}
                          {exp.current
                            ? ' – Present'
                            : exp.end_date
                              ? ` – ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                              : ''}
                        </p>
                      </div>
                      {bulletItems.length > 0 ? (
                        <ul className="list-disc space-y-1 pl-5 text-sm text-[#2d3436]">
                          {bulletItems.map((item, bulletIndex) => (
                            <li key={`${exp.company}-point-${bulletIndex}`} className="marker:text-[#2b6750]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : exp.description ? (
                        <p className="text-sm leading-relaxed text-[#2d3436] whitespace-pre-line">
                          {exp.description}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <section className="space-y-4">
              {accentHeading('Education')}
              <div className="flex flex-col gap-3">
                {resumeData.education.map((edu, index) => (
                  <div key={`${edu.institution}-${index}`} className="space-y-1">
                    <p className="text-sm font-semibold text-[#2b6750] uppercase tracking-[0.18em]">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ''}
                    </p>
                    <p className="text-sm italic text-[#1f2933]">
                      {edu.institution}
                      {edu.location ? `, ${edu.location}` : ''}
                    </p>
                    <p className="text-xs font-medium text-[#5f6f65] uppercase">
                      {edu.start_date
                        ? new Date(edu.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : ''}
                      {edu.current
                        ? ' – Present'
                        : edu.end_date
                          ? ` – ${new Date(edu.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                          : ''}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-[#2d3436]">{edu.description}</p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-[#2d3436]">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {flattenedSkills.length > 0 && (
            <section className="space-y-3">
              {accentHeading('Additional Skills')}
              <ul className="list-disc columns-2 space-y-1 pl-5 text-sm text-[#2d3436]">
                {flattenedSkills.map((skill, index) => (
                  <li key={`${skill}-${index}`} className="marker:text-[#2b6750]">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section className="space-y-4">
              {accentHeading('Selected Projects')}
              <div className="flex flex-col gap-3">
                {resumeData.projects.map((project, index) => (
                  <div key={`${project.title}-${index}`} className="space-y-1">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm font-semibold text-[#2b6750] uppercase tracking-[0.18em]">
                        {project.title}
                      </p>
                      {project.start_date && (
                        <p className="text-xs font-medium text-[#5f6f65] uppercase">
                          {new Date(project.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-[#2d3436]">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-xs uppercase tracking-[0.18em] text-[#5f6f65]">
                        Tech: {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(resumeData.awards && resumeData.awards.length > 0) ||
          (resumeData.achievements && resumeData.achievements.length > 0) ||
          (resumeData.certificates && resumeData.certificates.length > 0) ? (
            <section className="space-y-4">
              {accentHeading('Highlights')}
              <ul className="list-disc space-y-2 pl-5 text-sm text-[#2d3436]">
                {resumeData.awards?.map((award, index) => (
                  <li key={`award-${index}`} className="marker:text-[#2b6750]">
                    <span className="font-semibold">{award.title}</span>
                    {award.issuer ? ` · ${award.issuer}` : ''}
                    {award.date
                      ? ` (${new Date(award.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`
                      : ''}
                  </li>
                ))}
                {resumeData.achievements?.map((achievement, index) => (
                  <li key={`achievement-${index}`} className="marker:text-[#2b6750]">
                    <span className="font-semibold">{achievement.title}</span>
                    {achievement.description ? ` – ${achievement.description}` : ''}
                  </li>
                ))}
                {resumeData.certificates?.map((cert, index) => (
                  <li key={`certificate-${index}`} className="marker:text-[#2b6750]">
                    {cert}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(resumeData.communication_languages && resumeData.communication_languages.length > 0) ||
          (resumeData.hobbies && resumeData.hobbies.length > 0) ? (
            <section className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {resumeData.communication_languages && resumeData.communication_languages.length > 0 && (
                  <div className="space-y-2">
                    {accentHeading('Languages')}
                    <p className="text-sm text-[#2d3436]">
                      {resumeData.communication_languages.join(', ')}
                    </p>
                  </div>
                )}
                {resumeData.hobbies && resumeData.hobbies.length > 0 && (
                  <div className="space-y-2">
                    {accentHeading('Interests')}
                    <p className="text-sm text-[#2d3436]">{resumeData.hobbies.join(', ')}</p>
                  </div>
                )}
              </div>
            </section>
          ) : null}

          <footer className="mt-4 flex items-center justify-center gap-3">
            {["#0f5d4f", "#1f3f5b", "#3c6e71", "#8b3a3a", "#1d3557"].map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full border border-black/5"
                style={{ backgroundColor: color }}
              />
            ))}
          </footer>
        </div>
      </div>
    );
  };

  const renderElegantTemplate = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => (
    <div
      ref={templateRef}
      className="w-[210mm] min-h-[297mm] bg-white print:p-0"
      data-pdf-content
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      <div className="grid min-h-[297mm] grid-cols-[70mm_auto]">
        <aside className="bg-gradient-to-b from-purple-600 via-fuchsia-500 to-orange-400 p-[18mm] text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.3em] text-white/70">Profile</div>
              <h1 className="text-3xl font-semibold leading-tight">{resumeData.full_name}</h1>
            </div>

            {resumeData.profile_picture && (
              <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-white/40 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resumeData.profile_picture}
                  alt={`${resumeData.full_name} avatar`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2 text-sm text-white/80">
              {renderContactLinks(resumeData)}
            </div>

            <div className="space-y-2 text-sm text-white/80">
              {renderSocialLinks(resumeData)}
            </div>

            <Separator className="bg-white/30" />

            {resumeData.skills && resumeData.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Array.isArray(resumeData.skills) && typeof resumeData.skills[0] === 'object' && 'category' in resumeData.skills[0]
                    ? (resumeData.skills as { category: string; skills: string[] }[]).flatMap((skillCat) => skillCat.skills)
                    : (resumeData.skills as string[])
                  ).map((skillItem, index) => (
                    <span
                      key={`${skillItem}-${index}`}
                      className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
                    >
                      {skillItem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resumeData.communication_languages && resumeData.communication_languages.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70">Languages</h2>
                <p className="mt-2 text-sm text-white/80">{resumeData.communication_languages.join(', ')}</p>
              </div>
            )}
          </div>
        </aside>

        <main className="bg-white p-[24mm]">
          {renderProfessionalSummary(resumeData)}
          {renderExperience(resumeData)}
          {renderProjects(resumeData)}
          {renderEducation(resumeData)}
          {renderAdditionalSections(resumeData)}
        </main>
      </div>
    </div>
  );

  type TemplateRenderer = (resumeData: Resume, templateRef?: Ref<HTMLDivElement>) => ReactElement;

  const templateRendererMap: Record<string, TemplateRenderer> = {
    classic: renderClassicTemplate,
    modern: renderModernTemplate,
    minimal: renderMinimalTemplate,
    elegant: renderElegantTemplate,
    emerald: renderEmeraldTemplate,
    slate: renderSlateTemplate,
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const id = params.id as string;
        const data = await getResumeById(id);
        setResume(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id]);

  // Persist the resume so it appears on the dashboard "My Resumes" list.
  const handleSaveResume = async () => {
    if (!resume || saving) return;

    setSaving(true);
    setSaveError(null);

    try {
      // Explicitly mark the resume as active so it surfaces in dashboard listings.
      await updateResume(resume.id, { is_active: true });
      setSaved(true);
    } catch (err) {
      console.error("Error saving resume:", err);
      setSaveError(err instanceof Error ? err.message : "Unable to save resume. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  // Quick template switch from preview sidebar.
  const handleTemplateQuickSwitch = async (templateId: string) => {
    if (!resume || templateSwitchingId === templateId) return;
    try {
      setTemplateSwitchingId(templateId);
      setSwitchError(null);

      const updated = await updateResume(resume.id, { template_id: templateId });
      setResume(updated);
    } catch (switchErr) {
      console.error("Error switching template from preview:", switchErr);
      setSwitchError(switchErr instanceof Error ? switchErr.message : "Unable to change template. Try again.");
    } finally {
      setTemplateSwitchingId(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Resume not found"}</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const selectedRenderer =
    resume.template_id && templateRendererMap[resume.template_id]
      ? templateRendererMap[resume.template_id]
      : renderClassicTemplate;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 py-8">
      {/* Animated Background with multiple layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      {/* Header with actions */}
      <div className="relative z-10 mx-auto mb-10 max-w-[1800px] space-y-3 px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/resume/${params.id}`)}
            className="group border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-500/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Resume
          </Button>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={handleSaveResume}
              disabled={saving || saved}
              className={`group relative overflow-hidden border backdrop-blur-xl transition-all duration-300 ${saved ? "bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/20" : "bg-gradient-to-r from-black to-zinc-900 border-white/10 hover:border-white/30 shadow-lg shadow-black/20 hover:shadow-white/10"} text-white`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                "Save Resume"
              )}
            </Button>

            <PDFDownloadButton
              resume={resume}
              styleSettings={{
                fontFamily: styleSettings.fontFamily,
                accentColor: styleSettings.accentColor,
                pageBackground: styleSettings.pageBackground,
                textColor: styleSettings.textColor,
                accentStrength: accentStrength,
              }}
              className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 border-0 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            />

            <Download1Button
              resume={resume}
              templateRef={resumeRef}
              className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 border-0 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            />
          </div>
        </div>

        {saveError && <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-2.5 backdrop-blur-xl shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">{saveError}</p>}
        {saved && !saveError && (
          <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-2.5 backdrop-blur-xl shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
            ✨ Resume saved successfully. You can find it on your dashboard under &quot;My Resumes&quot;.
          </p>
        )}
        {switchError && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-2.5 backdrop-blur-xl shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
            {switchError}
          </p>
        )}
      </div>

      {/* Main layout with sidebar + preview */}
      <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-8 px-6 lg:flex-row lg:items-start">
        {/* Sidebar for template quick selection */}
        <aside className="order-2 lg:order-1 lg:w-[340px] lg:shrink-0">
          <div className="sticky top-6 flex flex-col max-h-[calc(100vh-3rem)] rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-black/60 to-black/40 shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl ring-1 ring-white/5 overflow-hidden">
            <div className="p-6 pb-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Templates</h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Switch layouts instantly without leaving the preview.
              </p>
            </div>

            {/* Scrollable template list */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
              {TEMPLATE_QUICK_OPTIONS.map((option) => {
                const isActive = resume.template_id === option.id || (!resume.template_id && option.id === "classic");
                const isLoading = templateSwitchingId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleTemplateQuickSwitch(option.id)}
                    disabled={isLoading}
                    className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-500 ${
                      isActive
                        ? "border-cyan-400/60 shadow-2xl shadow-cyan-500/30"
                        : "border-white/10 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/20"
                    }`}
                  >
                    {/* Template Preview */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />
                      
                      {/* Template Image */}
                      <Image
                        src={option.previewImage}
                        alt={option.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 340px"
                      />
                      
                      {/* Use this template overlay */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm shadow-xl">
                            Active Template
                          </div>
                        </div>
                      )}
                      
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Template Info */}
                    <div className={`relative p-4 ${
                      isActive ? "bg-black/80" : "bg-black/60"
                    }`}>
                      <h3 className="text-base font-bold text-white mb-1">{option.name}</h3>
                      <p className="text-xs text-zinc-400 mb-3">{option.summary}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md bg-white/10 text-zinc-300 border border-white/10">PDF</span>
                        <span className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md bg-white/10 text-zinc-300 border border-white/10">DOCX</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer button */}
            <div className="p-6 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => router.push(`/resume/${params.id}/templates`)}
                className="group w-full border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 text-xs font-semibold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <span className="relative z-10">Explore full gallery</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Preview area */}
        <div className="order-1 flex-1 lg:order-2">
          <div className="mx-auto w-full max-w-[210mm] bg-white shadow-2xl shadow-cyan-500/30 ring-1 ring-cyan-400/20 rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:shadow-cyan-500/40 hover:ring-cyan-400/30">
            {(() => {
              const rendered = selectedRenderer(resume, resumeRef) as ReactElement<{ style?: CSSWithVars }>;
              if (isValidElement(rendered)) {
                // Merge the dynamic styles onto the root template container.
                const existingStyle = (rendered.props.style ?? {}) as CSSWithVars;
                const mergedStyle: CSSWithVars = {
                  ...existingStyle,
                  fontFamily: styleSettings.fontFamily,
                  color: styleSettings.textColor,
                  backgroundColor: styleSettings.pageBackground,
                  '--accent-color': styleSettings.accentColor,
                  '--accent-strength': `${accentStrength}%`,
                };

                return cloneElement(rendered, {
                  style: mergedStyle,
                });
              }
              return rendered;
            })()}
          </div>
        </div>

        {/* Style editor rail on the right */}
        <aside className="order-3 lg:order-3 lg:w-[360px] lg:shrink-0">
          <div className="sticky top-6 space-y-6 rounded-2xl border border-purple-500/20 bg-gradient-to-b from-black/60 to-black/40 p-6 shadow-2xl shadow-purple-500/20 backdrop-blur-2xl ring-1 ring-white/5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <div className="absolute inset-0 h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Styles</h2>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Personalize fonts, color accents, and overall mood.
              </p>
            </div>

            {/* Theme presets */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.32em] text-zinc-300">Presets</h3>
              <div className="grid gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isPresetActive =
                    styleSettings.fontFamily === preset.fontFamily &&
                    styleSettings.accentColor === preset.accentColor &&
                    styleSettings.pageBackground === preset.pageBackground &&
                    styleSettings.textColor === preset.textColor &&
                    (preset.accentStrength === undefined || preset.accentStrength === accentStrength);

                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-500 ${
                        isPresetActive
                          ? "border-purple-400/60 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 text-white shadow-2xl shadow-purple-500/30 scale-[1.02]"
                          : "border-white/10 bg-gradient-to-br from-white/5 to-white/0 text-zinc-300 hover:border-purple-400/40 hover:from-purple-500/10 hover:to-pink-500/10 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.01]"
                      }`}
                    >
                      <span
                        className="absolute inset-0 opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-50 group-hover:blur-3xl"
                        style={{ background: `linear-gradient(135deg, ${preset.accentColor}, ${preset.pageBackground})` }}
                        aria-hidden
                      />
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative space-y-2 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold">{preset.name}</p>
                            <p className="text-xs text-inherit/70">{preset.description}</p>
                          </div>
                          {isPresetActive && (
                            <span className="rounded-full border border-purple-300/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-200 shadow-lg shadow-purple-500/30 animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-inherit/80">
                          <span>Tap to apply palette</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font selector */}
            <div className="space-y-3">
              <Label htmlFor="font-select" className="text-xs font-bold uppercase tracking-[0.32em] text-zinc-300">
                Font Family
              </Label>
              <div className="relative">
                <select
                  id="font-select"
                  value={styleSettings.fontFamily}
                  onChange={handleFontChange}
                  className="w-full appearance-none rounded-xl border-2 border-black/10 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 shadow-sm transition hover:border-black/20 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                  style={{ fontFamily: styleSettings.fontFamily }}
                >
                  {FONT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} style={{ fontFamily: option.value }}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Current: <span className="font-medium text-slate-700" style={{ fontFamily: styleSettings.fontFamily }}>
                  {FONT_OPTIONS.find(f => f.value === styleSettings.fontFamily)?.label || 'Custom'}
                </span>
              </p>
            </div>

            {/* Color pickers */}
            <div className="grid gap-4">
              {([
                ['accentColor', 'Accent color', 'Primary highlight for headings and borders'],
                ['pageBackground', 'Page background', 'Canvas color behind all content'],
                ['textColor', 'Body text', 'Main paragraph and label color'],
              ] as Array<[keyof PreviewStyleSettings, string, string]>).map(([key, label, hint]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">{label}</Label>
                  <p className="text-[11px] leading-relaxed text-slate-500">{hint}</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Input
                        type="color"
                        value={styleSettings[key]}
                        onChange={handleColorChange(key)}
                        className="h-12 w-12 cursor-pointer rounded-xl border-2 border-black/10 p-1 shadow-sm transition hover:border-black/20 focus:border-black focus:ring-2 focus:ring-black/5"
                      />
                      <div 
                        className="pointer-events-none absolute inset-0 rounded-xl border-2 border-white/40"
                        aria-hidden
                      />
                    </div>
                    <Input
                      type="text"
                      value={styleSettings[key]}
                      onChange={handleColorChange(key)}
                      placeholder="#000000"
                      className="flex-1 rounded-xl border-2 border-black/10 px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-sm transition hover:border-black/20 focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Accent strength slider */}
            <div className="space-y-3">
              <Label htmlFor="accent-strength" className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
                Accent depth
              </Label>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Controls the intensity and opacity of accent elements throughout the template.
              </p>
              <div className="flex items-center gap-4">
                <input
                  id="accent-strength"
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={accentStrength}
                  onChange={handleAccentStrengthChange}
                  className="flex-1 accent-black"
                  style={{
                    background: `linear-gradient(to right, ${styleSettings.accentColor} 0%, ${styleSettings.accentColor} ${accentStrength}%, #e2e8f0 ${accentStrength}%, #e2e8f0 100%)`
                  }}
                />
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold tabular-nums text-slate-700">
                  {accentStrength}%
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400">
                <span>Subtle (20%)</span>
                <span>Bold (100%)</span>
              </div>
            </div>

            <Separator className="bg-black/5" />

            <Button
              variant="outline"
              size="sm"
              className="w-full border-2 border-black/20 bg-white text-slate-900 font-semibold uppercase tracking-wider shadow-sm transition hover:border-black hover:bg-black hover:text-white"
              onClick={() => applyPreset(THEME_PRESETS[0])}
            >
              Reset to default
            </Button>
          </div>
        </aside>
      </div>

      {/* Bottom spacing */}
      <div className="h-12"></div>
      
      {/* Thanks Footer */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="relative py-8 text-center">
            <div className="mb-3">
              <span className="text-5xl">✨</span>
            </div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
              Thanks for using ResumePersona
            </h3>
            <p className="text-sm text-zinc-400">
              Your perfect resume is just a click away
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
