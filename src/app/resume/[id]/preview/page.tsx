"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { getResumeById } from "@/lib/supabase/resume-service";
import type { Resume } from "@/types/resume";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const resumeRef = useRef<HTMLDivElement>(null);

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

  // Download resume as PDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current || !resume) return;

    setDownloading(true);
    try {
      const element = resumeRef.current;

      const applyInlineStyles = (source: HTMLElement, target: HTMLElement) => {
        const computedStyle = window.getComputedStyle(source);
        const cssText = Array.from(computedStyle)
          .map((prop) => `${prop}: ${computedStyle.getPropertyValue(prop)};`)
          .join(' ');
        target.setAttribute('style', cssText);

        Array.from(source.children).forEach((child, index) => {
          const targetChild = target.children[index] as HTMLElement | undefined;
          if (child instanceof HTMLElement && targetChild) {
            applyInlineStyles(child, targetChild);
          }
        });
      };

      // Capture the resume as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (element) => {
          // Ignore elements that might have problematic CSS
          return element.classList?.contains('no-pdf');
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-content]') as HTMLElement | null;
          if (clonedElement) {
            applyInlineStyles(element, clonedElement);
          }

          clonedDoc.querySelectorAll('style').forEach((styleNode) => {
            if (styleNode.innerHTML.includes('lab(') || styleNode.innerHTML.includes('oklch(')) {
              styleNode.parentElement?.removeChild(styleNode);
            }
          });

          clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((linkNode) => {
            const linkElement = linkNode as HTMLLinkElement;
            if (linkElement.href && linkElement.href.includes('tailwind')) {
              linkElement.parentElement?.removeChild(linkElement);
            }
          });
        },
      });

      // A4 dimensions in mm
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download PDF with sanitized filename
      const filename = `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume'}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
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

  return (
    <div className="min-h-screen bg-[#eeeeee] py-8">
      {/* Header with actions */}
      <div className="max-w-[210mm] mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/resume/${params.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-black hover:bg-black/90 text-white"
          >
            {downloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4 text-white" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* A4 Preview Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl">
        <div
          ref={resumeRef}
          data-pdf-content
          className="w-[210mm] min-h-[297mm] bg-white p-[15mm] print:p-0"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundColor: '#ffffff',
            color: '#000000',
          }}
        >
          {/* Header Section */}
          <div className="mb-6 pb-4 border-b-2 border-black">
            <h1 className="text-4xl font-bold mb-2 text-black">
              {resume.full_name}
            </h1>
            
            {/* Contact Information */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
              {resume.email && (
                <a
                  href={`mailto:${resume.email}`}
                  className="hover:text-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resume.email}
                </a>
              )}
              {resume.contact_number && (
                <a
                  href={`tel:${resume.contact_number}`}
                  className="hover:text-black hover:underline"
                >
                  {resume.contact_number}
                </a>
              )}
              {resume.address && <span>{resume.address}</span>}
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mt-1">
              {resume.linkedin_url && (
                <a
                  href={resume.linkedin_url}
                  className="hover:text-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {resume.github_url && (
                <a
                  href={resume.github_url}
                  className="hover:text-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
              {resume.portfolio_url && (
                <a
                  href={resume.portfolio_url}
                  className="hover:text-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resume.professional_summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-black uppercase tracking-wide">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-800 leading-relaxed">
                {resume.professional_summary}
              </p>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Education
              </h2>
              {resume.education.map((edu, index) => (
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
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Skills
              </h2>
              {Array.isArray(resume.skills) && typeof resume.skills[0] === 'object' && 'category' in resume.skills[0] ? (
                // Categorized skills
                <div className="space-y-2">
                  {(resume.skills as { category: string; skills: string[] }[]).map((skillCat, index) => (
                    <div key={index}>
                      <span className="font-semibold text-sm text-black">{skillCat.category}: </span>
                      <span className="text-sm text-gray-700">{skillCat.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                // Simple skills list
                <div className="text-sm text-gray-700">
                  {(resume.skills as string[]).join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Work Experience
              </h2>
              {resume.experience.map((exp, index) => (
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
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Projects
              </h2>
              {resume.projects.map((project, index) => (
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
                      <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {resume.awards && resume.awards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Awards & Honors
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {resume.awards.map((award, index) => (
                  <li key={index}>
                    <span className="font-semibold">{award.title}</span>
                    {award.issuer && ` - ${award.issuer}`}
                    {award.date && ` (${new Date(award.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {resume.achievements && resume.achievements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Achievements
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {resume.achievements.map((achievement, index) => (
                  <li key={index}>
                    <span className="font-semibold">{achievement.title}</span>
                    {achievement.description && `: ${achievement.description}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certificates */}
          {resume.certificates && resume.certificates.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Certifications
              </h2>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {resume.certificates.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {resume.communication_languages && resume.communication_languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Languages
              </h2>
              <p className="text-sm text-gray-700">
                {resume.communication_languages.join(', ')}
              </p>
            </div>
          )}

          {/* Hobbies */}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-black uppercase tracking-wide">
                Interests
              </h2>
              <p className="text-sm text-gray-700">
                {resume.hobbies.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
