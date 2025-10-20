import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume, SkillCategory } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';

/**
 * Elegant PDF Template
 * Purple gradient sidebar with elegant typography
 * Now supports dynamic styling!
 */

// Create dynamic styles based on user preferences
const createStyles = (styleSettings?: PDFStyleSettings) => {
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#9333ea';
  const pageBackground = styleSettings?.pageBackground || '#ffffff';
  const textColor = styleSettings?.textColor || '#111827';

  return StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 10,
    fontFamily: font,
    backgroundColor: pageBackground,
  },
  sidebar: {
    width: '35%',
    backgroundColor: accentColor,
    padding: 30,
    paddingTop: 40,
  },
  mainContent: {
    width: '65%',
    padding: 40,
    paddingTop: 40,
  },
  // Sidebar Styles
  profileLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sidebarName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 1.3,
  },
  sidebarSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1 solid rgba(255, 255, 255, 0.3)',
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sidebarText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  sidebarLink: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    marginBottom: 6,
  },
  skillBadge: {
    fontSize: 8,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4 8',
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  // Main Content Styles
  mainSection: {
    marginBottom: 20,
  },
  mainSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textColor,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: textColor,
    textAlign: 'justify',
    opacity: 0.8,
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: textColor,
  },
  company: {
    fontSize: 10,
    color: textColor,
    opacity: 0.7,
    marginTop: 2,
  },
  location: {
    fontSize: 9,
    color: textColor,
    opacity: 0.6,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: textColor,
    opacity: 0.6,
    marginTop: 2,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.75,
    marginTop: 6,
  },
  bulletPoint: {
    fontSize: 9,
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.75,
    marginLeft: 10,
    marginTop: 4,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: textColor,
  },
  institution: {
    fontSize: 10,
    color: textColor,
    opacity: 0.7,
    marginTop: 2,
  },
  gpa: {
    fontSize: 9,
    color: textColor,
    opacity: 0.7,
    marginTop: 2,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: textColor,
  },
  projectTech: {
    fontSize: 8,
    color: textColor,
    opacity: 0.6,
    marginTop: 2,
  },
  projectDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.75,
    marginTop: 4,
  },
  link: {
    color: accentColor,
    textDecoration: 'underline',
  },
  });
};

interface ElegantPDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;
}

export function ElegantPDF({ resume, styles: styleSettings }: ElegantPDFProps) {
  const styles = createStyles(styleSettings);
  // Helper to format date ranges
  const formatDateRange = (startDate?: string, endDate?: string, current?: boolean) => {
    if (!startDate) return '';
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (current) return `${start} - Present`;
    if (!endDate) return start;
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  // Flatten skills array
  const flattenSkills = (skills: SkillCategory[] | string[]): string[] => {
    if (!Array.isArray(skills) || skills.length === 0) return [];
    if (typeof skills[0] === 'string') return skills as string[];
    return (skills as SkillCategory[]).flatMap(cat => cat.skills);
  };

  const skillsList = flattenSkills(resume.skills);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Purple Sidebar */}
        <View style={styles.sidebar}>
          {/* Profile Section */}
          <View>
            <Text style={styles.profileLabel}>PROFILE</Text>
            <Text style={styles.sidebarName}>{resume.full_name}</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.sidebarSection}>
            {resume.email && (
              <Link src={`mailto:${resume.email}`} style={styles.sidebarLink}>
                {resume.email}
              </Link>
            )}
            {resume.contact_number && (
              <Text style={styles.sidebarText}>{resume.contact_number}</Text>
            )}
            {resume.address && (
              <Text style={styles.sidebarText}>{resume.address}</Text>
            )}
          </View>

          {/* Social Links */}
          {(resume.linkedin_url || resume.github_url || resume.portfolio_url) && (
            <View style={styles.sidebarSection}>
              {resume.linkedin_url && (
                <Link src={resume.linkedin_url} style={styles.sidebarLink}>
                  LinkedIn
                </Link>
              )}
              {resume.github_url && (
                <Link src={resume.github_url} style={styles.sidebarLink}>
                  GitHub
                </Link>
              )}
              {resume.portfolio_url && (
                <Link src={resume.portfolio_url} style={styles.sidebarLink}>
                  Portfolio
                </Link>
              )}
            </View>
          )}

          {/* Skills */}
          {skillsList.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>SKILLS</Text>
              <View style={styles.skillsContainer}>
                {skillsList.map((skill, index) => (
                  <Text key={index} style={styles.skillBadge}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {resume.communication_languages && resume.communication_languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>LANGUAGES</Text>
              <Text style={styles.sidebarText}>
                {resume.communication_languages.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Professional Summary */}
          {resume.professional_summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Professional Summary</Text>
              <Text style={styles.summary}>{resume.professional_summary}</Text>
            </View>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Work Experience</Text>
              {resume.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
                    {exp.location && <Text style={styles.location}>{exp.location}</Text>}
                    <Text style={styles.date}>
                      {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={styles.description}>{exp.description}</Text>
                  )}
                  {exp.achievements && exp.achievements.map((achievement, i) => (
                    <Text key={i} style={styles.bulletPoint}>• {achievement}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Projects</Text>
              {resume.projects.map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  {project.url ? (
                    <Link src={project.url} style={[styles.projectTitle, styles.link]}>
                      {project.title}
                    </Link>
                  ) : (
                    <Text style={styles.projectTitle}>{project.title}</Text>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.projectTech}>
                      Tech: {project.technologies.join(', ')}
                    </Text>
                  )}
                  {project.description && (
                    <Text style={styles.projectDescription}>{project.description}</Text>
                  )}
                  {project.highlights && project.highlights.map((highlight, i) => (
                    <Text key={i} style={styles.bulletPoint}>• {highlight}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Education</Text>
              {resume.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <Text style={styles.degree}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </Text>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  <Text style={styles.date}>
                    {formatDateRange(edu.start_date, edu.end_date, edu.current)}
                  </Text>
                  {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                  {edu.description && <Text style={styles.description}>{edu.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {resume.awards && resume.awards.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Awards & Achievements</Text>
              {resume.awards.map((award, index) => (
                <View key={index} style={styles.projectItem}>
                  <Text style={styles.projectTitle}>{award.title}</Text>
                  <Text style={styles.company}>{award.issuer}</Text>
                  <Text style={styles.date}>
                    {new Date(award.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                  {award.description && (
                    <Text style={styles.description}>{award.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
