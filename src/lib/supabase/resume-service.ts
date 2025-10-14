import { createClient } from './client';
import type { Resume, CreateResumeInput } from '@/types/resume';

/**
 * Resume Service
 * Handles all resume-related database operations
 */

/**
 * Fetch all resumes for the current user
 */
export async function getUserResumes(): Promise<Resume[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch a single resume by ID
 */
export async function getResumeById(id: string): Promise<Resume | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new resume
 */
export async function createResume(
  resume: Omit<CreateResumeInput, 'user_id'> & { is_active?: boolean }
): Promise<Resume> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { is_active: isActiveOverride, ...resumePayload } = resume;

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      ...resumePayload,
      user_id: user.id,
      is_active: isActiveOverride ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating resume:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing resume
 */
export async function updateResume(id: string, updates: Partial<Resume>): Promise<Resume> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating resume:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a resume
 */
export async function deleteResume(id: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}

/**
 * Toggle resume active status
 */
export async function toggleResumeActive(id: string, isActive: boolean): Promise<Resume> {
  return updateResume(id, { is_active: isActive });
}

/**
 * Duplicate a resume
 */
export async function duplicateResume(id: string): Promise<Resume> {
  const supabase = createClient();
  
  // Fetch the original resume
  const original = await getResumeById(id);
  
  if (!original) {
    throw new Error('Resume not found');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Create a copy without id, created_at, updated_at
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _created, updated_at: _updated, ...resumeData } = original;

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      ...resumeData,
      user_id: user.id,
      title: `${original.title} (Copy)`,
    })
    .select()
    .single();

  if (error) {
    console.error('Error duplicating resume:', error);
    throw error;
  }

  return data;
}

/**
 * Get active resumes count for the current user
 */
export async function getActiveResumesCount(): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    console.error('Error counting active resumes:', error);
    throw error;
  }

  return count || 0;
}
