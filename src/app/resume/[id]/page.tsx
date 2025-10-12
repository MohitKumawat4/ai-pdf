"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Edit,
  Download,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Loader2,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Code,
  Briefcase
} from "lucide-react";
import { getResumeById } from "@/lib/supabase/resume-service";
import type { Resume } from "@/types/resume";

/**
 * Resume View/Profile Page
 * Displays a single resume with all information
 * Provides edit and download options
 */

export default function ResumeViewPage() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/resume/${resume.id}/preview`}>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Preview & Download
              </Button>
            </Link>
            <Link href={`/resume/${resume.id}/edit`}>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Resume Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{resume.title}</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date(resume.updated_at).toLocaleDateString()}
          </p>
        </div>

        {/* Basic Information */}
        <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">{resume.full_name}</CardTitle>
            <CardDescription className="text-base">
              {resume.professional_summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${resume.email}`} className="hover:text-primary">
                  {resume.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{resume.contact_number}</span>
              </div>
              {resume.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{resume.address}</span>
                </div>
              )}
            </div>

            {(resume.linkedin_url || resume.portfolio_url || resume.github_url) && (
              <>
                <Separator className="bg-white/10" />
                <div className="flex flex-wrap gap-4">
                  {resume.linkedin_url && (
                    <a
                      href={resume.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {resume.portfolio_url && (
                    <a
                      href={resume.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </a>
                  )}
                  {resume.github_url && (
                    <a
                      href={resume.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.education.map((edu, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {edu.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {edu.start_date} - {edu.end_date || "Present"}
                        </div>
                      )}
                      {edu.gpa && <div className="mt-1">GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  )}
                  {index < resume.education.length - 1 && (
                    <Separator className="mt-4 bg-white/10" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(resume.skills) && typeof resume.skills[0] === 'object' && 'category' in resume.skills[0] ? (
                // Categorized skills
                (resume.skills as { category: string; skills: string[] }[]).map((skillCat, index: number) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-sm">{skillCat.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillCat.skills.map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="secondary" className="bg-white/10">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Simple skills array
                <div className="flex flex-wrap gap-2">
                  {(resume.skills as string[]).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {resume.experience && Array.isArray(resume.experience) && resume.experience.length > 0 && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                      </div>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {index < resume.experience.length - 1 && (
                    <Separator className="mt-4 bg-white/10" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {resume.projects && Array.isArray(resume.projects) && resume.projects.length > 0 && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {project.highlights.map((highlight, hlIndex) => (
                        <li key={hlIndex}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  {index < resume.projects.length - 1 && (
                    <Separator className="mt-4 bg-white/10" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Awards & Achievements */}
        {((resume.awards && resume.awards.length > 0) || (resume.achievements && resume.achievements.length > 0)) && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Awards & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.awards && resume.awards.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Awards</h4>
                  {resume.awards.map((award, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{award.title}</p>
                        <span className="text-sm text-muted-foreground">{award.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{award.issuer}</p>
                      {award.description && (
                        <p className="text-sm text-muted-foreground">{award.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {resume.achievements && resume.achievements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Achievements</h4>
                  {resume.achievements.map((achievement, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{achievement.title}</p>
                        {achievement.date && (
                          <span className="text-sm text-muted-foreground">{achievement.date}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        {((resume.certificates && resume.certificates.length > 0) ||
          (resume.hobbies && resume.hobbies.length > 0) ||
          (resume.communication_languages && resume.communication_languages.length > 0)) && (
          <Card className="mb-6 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.certificates && resume.certificates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Certifications</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {resume.certificates.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              {resume.communication_languages && resume.communication_languages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.communication_languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/10">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {resume.hobbies && resume.hobbies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Hobbies & Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="outline">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
