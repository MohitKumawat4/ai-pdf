"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AIDescriptionGenerator } from "@/components/resume/ai-description-generator";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Plus, 
  Trash2,
  Save,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { createResume, getResumeById, updateResume } from "@/lib/supabase/resume-service";
import { createClient } from "@/lib/supabase/client";
import type { 
  EducationEntry, 
  ExperienceEntry, 
  ProjectEntry, 
  SkillCategory,
  AwardEntry,
  AchievementEntry
} from "@/types/resume";

/**
 * Resume Creation Form Page
 * Comprehensive form for creating a new resume with all database fields
 */

function CreateResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const isEditing = Boolean(resumeId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Track back navigation so we can disable the button and show feedback.
  const [backNavigating, setBackNavigating] = useState(false);
  // Track fetch state when editing so we can block render until data is ready.
  const [initializing, setInitializing] = useState(false);

  // Basic Information
  const [title, setTitle] = useState("My Resume");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [existingProfilePicture, setExistingProfilePicture] = useState<string>("");
  const [templateId, setTemplateId] = useState("classic");

  // Education
  const [education, setEducation] = useState<EducationEntry[]>([{
    institution: "",
    degree: "",
    field: "",
    start_date: "",
    end_date: "",
    gpa: "",
    description: ""
  }]);

  // Skills
  const [skills, setSkills] = useState<SkillCategory[]>([{
    category: "Technical Skills",
    skills: []
  }]);
  const [currentSkill, setCurrentSkill] = useState<{ [key: number]: string }>({});

  // Experience
  const [experience, setExperience] = useState<ExperienceEntry[]>([{
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    achievements: []
  }]);

  // Projects
  const [projects, setProjects] = useState<ProjectEntry[]>([{
    title: "",
    description: "",
    technologies: [],
    url: "",
    github_url: "",
    highlights: []
  }]);

  // Awards
  const [awards, setAwards] = useState<AwardEntry[]>([]);

  // Achievements
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);

  // Certificates, Hobbies, Languages
  const [certificates, setCertificates] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(["English"]);

  // Utility defaults to ensure the form always has at least one row available.
  const defaultEducation: EducationEntry = {
    institution: "",
    degree: "",
    field: "",
    start_date: "",
    end_date: "",
    gpa: "",
    description: "",
  };

  const defaultExperience: ExperienceEntry = {
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    achievements: [],
  };

  const defaultProject: ProjectEntry = {
    title: "",
    description: "",
    technologies: [],
    url: "",
    github_url: "",
    highlights: [],
  };

  useEffect(() => {
    return () => {
      // Only revoke blob URLs that were created locally to avoid DOM exceptions.
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  useEffect(() => {
    if (!resumeId) {
      return;
    }

    const loadResume = async () => {
      setInitializing(true);
      setError("");

      try {
        const resume = await getResumeById(resumeId);

        if (!resume) {
          setError("Unable to locate resume for editing.");
          return;
        }

        // Populate primitive fields.
        setTitle(resume.title);
        setFullName(resume.full_name);
        setEmail(resume.email);
        setContactNumber(resume.contact_number);
        setAddress(resume.address ?? "");
        setLinkedinUrl(resume.linkedin_url ?? "");
        setPortfolioUrl(resume.portfolio_url ?? "");
        setGithubUrl(resume.github_url ?? "");
        setProfessionalSummary(resume.professional_summary ?? "");
        setTemplateId(resume.template_id ?? "classic");

        // Store existing profile picture so we can persist it if no new upload occurs.
        const existingPicture = resume.profile_picture ?? "";
        setExistingProfilePicture(existingPicture);
        setProfileImagePreview(existingPicture);

        // Adapt skills into categorized format when necessary.
        if (Array.isArray(resume.skills) && resume.skills.length > 0) {
          if (typeof resume.skills[0] === "string") {
            setSkills([
              {
                category: "Core Skills",
                skills: resume.skills as string[],
              },
            ]);
          } else {
            setSkills(resume.skills as SkillCategory[]);
          }
        } else {
          setSkills([{ category: "Technical Skills", skills: [] }]);
        }

        // Populate nested collection data and fall back to one blank entry when needed.
        setEducation(resume.education && resume.education.length > 0 ? resume.education : [defaultEducation]);
        setExperience(resume.experience && resume.experience.length > 0 ? resume.experience : [defaultExperience]);
        setProjects(resume.projects && resume.projects.length > 0 ? resume.projects : [defaultProject]);
        setAwards(resume.awards ?? []);
        setAchievements(resume.achievements ?? []);
        setCertificates(resume.certificates ?? []);
        setHobbies(resume.hobbies ?? []);
        setLanguages(resume.communication_languages && resume.communication_languages.length > 0 ? resume.communication_languages : ["English"]);

      } catch (err) {
        console.error("Error loading resume for editing:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume data");
      } finally {
        setInitializing(false);
      }
    };

    loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      let profilePictureUrl: string | undefined;

      if (profileImageFile) {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }

        const user = authData?.user;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const fileExt = profileImageFile.name.split(".").pop() ?? "jpg";
        const filePath = `profile-pictures/${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resume-profile-pictures")
          .upload(filePath, profileImageFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: profileImageFile.type || "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("resume-profile-pictures")
          .getPublicUrl(filePath);

        profilePictureUrl = publicUrlData.publicUrl;
      } else if (existingProfilePicture) {
        // Preserve previously uploaded picture when editing.
        profilePictureUrl = existingProfilePicture;
      }

      const resumeData = {
        title,
        full_name: fullName,
        email,
        contact_number: contactNumber,
        address: address || undefined,
        linkedin_url: linkedinUrl || undefined,
        portfolio_url: portfolioUrl || undefined,
        github_url: githubUrl || undefined,
        professional_summary: professionalSummary || undefined,
        education: education.filter(edu => edu.institution && edu.degree),
        skills,
        experience: experience.filter(exp => exp.company && exp.position),
        projects: projects.filter(proj => proj.title),
        awards: awards.filter(award => award.title),
        achievements: achievements.filter(ach => ach.title),
        certificates: certificates.filter(cert => cert.trim()),
        hobbies: hobbies.filter(hobby => hobby.trim()),
        communication_languages: languages.filter(lang => lang.trim()),
        profile_picture: profilePictureUrl,
        template_id: templateId,
      };

      if (isEditing && resumeId) {
        await updateResume(resumeId, resumeData);
        router.push(`/resume/${resumeId}`);
      } else {
        const newResume = await createResume(resumeData);
        router.push(`/resume/${newResume.id}`);
      }
    } catch (err) {
      console.error("Error creating resume:", err);
      setError(err instanceof Error ? err.message : "Failed to create resume");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for dynamic arrays
  const addEducation = () => {
    setEducation([...education, {
      institution: "",
      degree: "",
      field: "",
      start_date: "",
      end_date: "",
      gpa: "",
      description: ""
    }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string | boolean) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addSkillCategory = () => {
    setSkills([...skills, { category: "", skills: [] }]);
  };

  const removeSkillCategory = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addSkillToCategory = (categoryIndex: number) => {
    const skill = currentSkill[categoryIndex]?.trim();
    if (!skill) return;

    const updated = [...skills];
    updated[categoryIndex].skills.push(skill);
    setSkills(updated);
    setCurrentSkill({ ...currentSkill, [categoryIndex]: "" });
  };

  const removeSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const updated = [...skills];
    updated[categoryIndex].skills = updated[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    setSkills(updated);
  };

  const addExperience = () => {
    setExperience([...experience, {
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      achievements: []
    }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string | boolean | string[]) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addProject = () => {
    setProjects([...projects, {
      title: "",
      description: "",
      technologies: [],
      url: "",
      github_url: "",
      highlights: []
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof ProjectEntry, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  if (initializing) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_50%)]" />
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 space-y-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="group mb-4 flex items-center gap-2 hover:bg-white/10 transition-all duration-300"
            disabled={backNavigating || loading}
            onClick={() => {
              if (backNavigating || loading) return;
              setBackNavigating(true);
              // When editing, always take the user back to the resume view page to avoid loops.
              if (resumeId) {
                router.push(`/resume/${resumeId}`);
                return;
              }

              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
                // Reset the loading indicator if navigation is cancelled or history is empty.
                setTimeout(() => setBackNavigating(false), 600);
              } else {
                router.push("/dashboard");
              }
            }}
          >
            {backNavigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Returning...
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </>
            )}
          </Button>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              Create New Resume
            </h1>
            <p className="text-xl text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Fill in your information to create a professional resume
            </p>
          </div>
        </div>

        {error && (
          <Card className="relative overflow-hidden mb-6 border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-200 backdrop-blur-xl shadow-xl shadow-red-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BorderBeam size={200} duration={15} colorFrom="#ef4444" colorTo="#dc2626" />
            <CardContent className="relative p-4">
              {error}
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume Title */}
          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <BorderBeam size={200} duration={15} delay={0} colorFrom="#06b6d4" colorTo="#a855f7" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="relative">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/30 blur-lg" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">Resume Title</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Input
                placeholder="e.g., Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border-cyan-500/20 focus:border-cyan-400/40 text-white placeholder:text-zinc-500 transition-colors"
                required
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="group relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <BorderBeam size={200} duration={15} delay={2} colorFrom="#06b6d4" colorTo="#a855f7" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="relative">
                  <User className="h-6 w-6 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/30 blur-lg" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">Basic Information</span>
              </CardTitle>
              <CardDescription className="text-zinc-400">Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="+1-555-0100"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="City, State, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="bg-white/5 border-white/10"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setProfileImageFile(file);
                      if (profileImagePreview) {
                        URL.revokeObjectURL(profileImagePreview);
                      }
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setProfileImagePreview(previewUrl);
                      } else {
                        setProfileImagePreview("");
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended size 400x400px JPG or PNG. Images are stored securely in Supabase Storage.
                  </p>
                </div>
                {profileImagePreview && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProfileImageFile(null);
                        if (profileImagePreview) {
                          URL.revokeObjectURL(profileImagePreview);
                        }
                        setProfileImagePreview("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="bg-white/10" />

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary with AI */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>A brief overview of your professional background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write a compelling summary of your professional experience and goals..."
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                className="min-h-[120px] bg-white/5 border-white/10"
              />
              
              <AIDescriptionGenerator
                label="Generate Professional Summary with AI"
                placeholder="Enter key points: years of experience, expertise, achievements..."
                onGenerate={(text) => setProfessionalSummary(text)}
                context="Professional Summary"
                type="summary"
              />
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </div>
                <Button type="button" onClick={addEducation} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        placeholder="University Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        className="bg-white/5 border-white/10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        className="bg-white/5 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.start_date}
                        onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.end_date}
                        onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>GPA (Optional)</Label>
                      <Input
                        placeholder="3.8"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Relevant coursework, honors, activities..."
                      value={edu.description}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills
                  </CardTitle>
                  <CardDescription>Your technical and professional skills</CardDescription>
                </div>
                <Button type="button" onClick={addSkillCategory} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {skills.map((skillCat, catIndex) => (
                <div key={catIndex} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Category (e.g., Programming Languages)"
                      value={skillCat.category}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[catIndex].category = e.target.value;
                        setSkills(updated);
                      }}
                      className="bg-white/5 border-white/10 max-w-xs"
                    />
                    {skills.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkillCategory(catIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill (e.g., JavaScript)"
                        value={currentSkill[catIndex] || ""}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, [catIndex]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkillToCategory(catIndex);
                          }
                        }}
                        className="bg-white/5 border-white/10"
                      />
                      <Button
                        type="button"
                        onClick={() => addSkillToCategory(catIndex)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillCat.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="bg-white/10 cursor-pointer hover:bg-white/20"
                          onClick={() => removeSkillFromCategory(catIndex, skillIndex)}
                        >
                          {skill}
                          <Trash2 className="ml-2 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>Your professional work history</CardDescription>
                </div>
                <Button type="button" onClick={addExperience} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Experience {index + 1}</h4>
                    {experience.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company *</Label>
                      <Input
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position *</Label>
                      <Input
                        placeholder="Job Title"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="City, State"
                        value={exp.location}
                        onChange={(e) => updateExperience(index, "location", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.start_date}
                        onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.end_date}
                        onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                        className="bg-white/5 border-white/10"
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your role and responsibilities..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <AIDescriptionGenerator
                    label="Generate Job Description with AI"
                    placeholder="Enter: company, role, key responsibilities, achievements..."
                    onGenerate={(text) => updateExperience(index, "description", text)}
                    context={`${exp.position} at ${exp.company}`}
                    type="experience"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Projects
                  </CardTitle>
                  <CardDescription>Your personal or professional projects</CardDescription>
                </div>
                <Button type="button" onClick={addProject} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Project {index + 1}</h4>
                    {projects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Project Title *</Label>
                    <Input
                      placeholder="Project Name"
                      value={project.title}
                      onChange={(e) => updateProject(index, "title", e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe your project..."
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project URL</Label>
                      <Input
                        type="url"
                        placeholder="https://project.com"
                        value={project.url}
                        onChange={(e) => updateProject(index, "url", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/..."
                        value={project.github_url}
                        onChange={(e) => updateProject(index, "github_url", e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <AIDescriptionGenerator
                    label="Generate Project Description with AI"
                    placeholder="Enter: project purpose, technologies used, key features..."
                    onGenerate={(text) => updateProject(index, "description", text)}
                    context={project.title}
                    type="project"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Resume...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Resume
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResumeFormFallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_50%)]" />
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
    </div>
  );
}

function CreateResumePage() {
  return (
    <Suspense fallback={<ResumeFormFallback />}>
      <CreateResumePageContent />
    </Suspense>
  );
}

export default CreateResumePage;
