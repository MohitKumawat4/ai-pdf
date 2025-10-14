/**
 * TypeScript types for Resume data structure
 * Matches the Supabase database schema
 */

// Education entry structure
export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
  location?: string;
}

// Skill category structure
export interface SkillCategory {
  category: string;
  skills: string[];
}

// Work experience entry
export interface ExperienceEntry {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

// Project entry
export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  highlights?: string[];
}

// Award entry
export interface AwardEntry {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

// Achievement entry
export interface AchievementEntry {
  title: string;
  description: string;
  date?: string;
}

// Volunteer work entry
export interface VolunteerEntry {
  organization: string;
  role: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

// Publication entry
export interface PublicationEntry {
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors?: string[];
  description?: string;
}

// Professional reference entry
export interface ReferenceEntry {
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

// Custom section entry
export interface CustomSection {
  title: string;
  content: string | string[];
  order?: number;
}

// Main Resume interface
export interface Resume {
  // Metadata
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_active: boolean;
  template_id?: string;

  // Basic Information
  full_name: string;
  profile_picture?: string;
  contact_number: string;
  email: string;
  address?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;

  // Professional Summary
  professional_summary?: string;

  // Structured Data (JSONB fields)
  education: EducationEntry[];
  skills: SkillCategory[] | string[]; // Can be categorized or simple array
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  awards?: AwardEntry[];
  achievements?: AchievementEntry[];

  // Array fields
  certificates?: string[];
  hobbies?: string[];
  communication_languages: string[];

  // Additional optional fields
  volunteer_work?: VolunteerEntry[];
  publications?: PublicationEntry[];
  professional_references?: ReferenceEntry[];

  // Custom sections
  custom_sections?: CustomSection[];
}

// Type for creating a new resume (without auto-generated fields)
export type CreateResumeInput = Omit<
  Resume,
  'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_active'
> & {
  user_id?: string;
  is_active?: boolean;
  template_id?: string;
  profile_picture?: string;
};

// Type for updating a resume (all fields optional except id)
export type UpdateResumeInput = Partial<Omit<Resume, 'id' | 'user_id' | 'created_at'>> & {
  id: string;
};

// Database response type
export interface ResumeResponse {
  data: Resume | Resume[] | null;
  error: Error | null;
}
