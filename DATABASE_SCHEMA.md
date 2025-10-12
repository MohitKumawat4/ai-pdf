# Database Schema Documentation

## Resumes Table

The `resumes` table stores comprehensive user resume information with support for multiple resumes per user.

### Table: `public.resumes`

#### Metadata Fields

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NO | - | Foreign key to `auth.users` |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | Last update timestamp (auto-updated) |
| `title` | TEXT | NO | 'Untitled Resume' | Resume title/name |
| `is_active` | BOOLEAN | NO | `true` | Whether resume is active |
| `template_id` | TEXT | YES | - | Template identifier |

#### Basic Information Fields

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `full_name` | TEXT | NO | Full name |
| `profile_picture` | TEXT | YES | URL to profile picture |
| `contact_number` | TEXT | NO | Contact phone number |
| `email` | TEXT | NO | Email address |
| `address` | TEXT | YES | Physical address |
| `linkedin_url` | TEXT | YES | LinkedIn profile URL |
| `portfolio_url` | TEXT | YES | Portfolio website URL |
| `github_url` | TEXT | YES | GitHub profile URL |
| `professional_summary` | TEXT | YES | Professional summary/objective |

#### Structured Data Fields (JSONB)

| Column | Type | Default | Description | Structure |
|--------|------|---------|-------------|-----------|
| `education` | JSONB | `[]` | Education history | Array of education entries |
| `skills` | JSONB | `[]` | Skills list | Array of skills or categorized skills |
| `experience` | JSONB | `[]` | Work experience | Array of experience entries |
| `projects` | JSONB | `[]` | Projects | Array of project entries |
| `awards` | JSONB | `[]` | Awards and honors | Array of award entries |
| `achievements` | JSONB | `[]` | Achievements | Array of achievement entries |
| `volunteer_work` | JSONB | `[]` | Volunteer experience | Array of volunteer entries |
| `publications` | JSONB | `[]` | Publications | Array of publication entries |
| `professional_references` | JSONB | `[]` | Professional references | Array of reference entries |
| `custom_sections` | JSONB | `[]` | Custom sections | Array of custom section entries |

#### Array Fields

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `certificates` | TEXT[] | `[]` | List of certifications |
| `hobbies` | TEXT[] | `[]` | Hobbies and interests |
| `communication_languages` | TEXT[] | `['English']` | Languages spoken |

---

## JSON Structure Examples

### Education Entry
```json
{
  "institution": "University of Example",
  "degree": "Bachelor of Science",
  "field": "Computer Science",
  "start_date": "2018-09",
  "end_date": "2022-05",
  "gpa": "3.8",
  "description": "Relevant coursework: Data Structures, Algorithms, Machine Learning",
  "location": "City, State"
}
```

### Skills (Categorized)
```json
[
  {
    "category": "Programming Languages",
    "skills": ["JavaScript", "TypeScript", "Python", "Java"]
  },
  {
    "category": "Frameworks",
    "skills": ["React", "Next.js", "Node.js", "Express"]
  }
]
```

### Skills (Simple Array)
```json
["JavaScript", "React", "Node.js", "Python", "SQL"]
```

### Experience Entry
```json
{
  "company": "Tech Company Inc.",
  "position": "Software Engineer",
  "location": "San Francisco, CA",
  "start_date": "2022-06",
  "end_date": "2024-01",
  "current": false,
  "description": "Developed and maintained web applications",
  "achievements": [
    "Improved application performance by 40%",
    "Led team of 3 developers",
    "Implemented CI/CD pipeline"
  ]
}
```

### Project Entry
```json
{
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce application with payment integration",
  "technologies": ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
  "url": "https://example.com",
  "github_url": "https://github.com/user/project",
  "start_date": "2023-01",
  "end_date": "2023-06",
  "highlights": [
    "Processed over $100K in transactions",
    "Served 10,000+ users"
  ]
}
```

### Award Entry
```json
{
  "title": "Best Innovation Award",
  "issuer": "Tech Conference 2023",
  "date": "2023-11",
  "description": "Awarded for innovative AI solution"
}
```

### Achievement Entry
```json
{
  "title": "Published Research Paper",
  "description": "Machine Learning in Healthcare - Published in IEEE Journal",
  "date": "2023-08"
}
```

### Volunteer Entry
```json
{
  "organization": "Code for Good",
  "role": "Volunteer Developer",
  "start_date": "2022-01",
  "end_date": "2023-12",
  "current": false,
  "description": "Built websites for non-profit organizations"
}
```

### Publication Entry
```json
{
  "title": "Advanced Machine Learning Techniques",
  "publisher": "IEEE Journal",
  "date": "2023-08",
  "url": "https://doi.org/example",
  "authors": ["John Doe", "Jane Smith"],
  "description": "Research on neural networks"
}
```

### Reference Entry
```json
{
  "name": "John Manager",
  "position": "Senior Engineering Manager",
  "company": "Tech Company Inc.",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "relationship": "Direct Manager"
}
```

### Custom Section Entry
```json
{
  "title": "Speaking Engagements",
  "content": [
    "Tech Conference 2023 - Keynote Speaker",
    "Developer Meetup - Panel Discussion"
  ],
  "order": 1
}
```

---

## Indexes

- `idx_resumes_user_id` - Index on `user_id` for fast user resume lookups
- `idx_resumes_created_at` - Index on `created_at DESC` for sorting by date
- `idx_resumes_is_active` - Partial index on active resumes

---

## Row Level Security (RLS)

RLS is enabled with the following policies:

1. **SELECT**: Users can only view their own resumes
2. **INSERT**: Users can only insert resumes for themselves
3. **UPDATE**: Users can only update their own resumes
4. **DELETE**: Users can only delete their own resumes

All policies check: `auth.uid() = user_id`

---

## Triggers

- **update_resumes_updated_at**: Automatically updates `updated_at` timestamp on row updates

---

## Foreign Key Constraints

- `user_id` references `auth.users(id)` with `ON DELETE CASCADE`
  - When a user is deleted, all their resumes are automatically deleted

---

## Usage Examples

### Create a new resume
```sql
INSERT INTO public.resumes (
  user_id,
  full_name,
  contact_number,
  email,
  education,
  skills
) VALUES (
  auth.uid(),
  'John Doe',
  '+1-555-0100',
  'john@example.com',
  '[{"institution": "MIT", "degree": "BS", "field": "CS"}]'::jsonb,
  '["JavaScript", "Python", "React"]'::jsonb
);
```

### Query user's resumes
```sql
SELECT * FROM public.resumes
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Update resume
```sql
UPDATE public.resumes
SET 
  title = 'Senior Developer Resume',
  professional_summary = 'Experienced software engineer...',
  updated_at = NOW()
WHERE id = 'resume-uuid'
  AND user_id = auth.uid();
```
