import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume, SkillCategory } from '@/types/resume';

/**
 * Professional PDF Template
 * Two-column layout with colored sidebar
 */

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#0f766e',
    padding: 30,
    paddingTop: 40,
  },
  mainContent: {
    width: '65%',
    padding: 40,
    paddingTop: 40,
  },
  sidebarName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 1.3,
  },
  sidebarSection: {
    marginTop: 25,
  },
  sidebarSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 9,
    color: '#d1fae5',
    lineHeight: 1.5,
  },
  sidebarLink: {
    fontSize: 9,
    color: '#ffffff',
    textDecoration: 'none',
    marginBottom: 5,
  },
  sidebarItem: {
    fontSize: 9,
    color: '#d1fae5',
    marginBottom: 5,
  },
  mainSection: {
    marginBottom: 20,
  },
  mainSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '2 solid #0f766e',
    paddingBottom: 5,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  company: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4b5563',
    marginTop: 5,
  },
  bulletPoint: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4b5563',
    marginLeft: 12,
    marginTop: 3,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  institution: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  projectItem: {
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  technologies: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 3,
  },
});

interface ProfessionalPDFProps {
  resume: Resume;
}

export const ProfessionalPDF = ({ resume }: ProfessionalPDFProps) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{resume.full_name}</Text>
          
          {/* Contact Info */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            {resume.email && (
              <Link src={`mailto:${resume.email}`} style={styles.sidebarLink}>
                {resume.email}
              </Link>
            )}
            {resume.contact_number && (
              <Link src={`tel:${resume.contact_number}`} style={styles.sidebarLink}>
                {resume.contact_number}
              </Link>
            )}
            {resume.address && (
              <Text style={styles.sidebarText}>{resume.address}</Text>
            )}
          </View>

          {/* Links */}
          {(resume.linkedin_url || resume.portfolio_url || resume.github_url) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Links</Text>
              {resume.linkedin_url && (
                <Link src={resume.linkedin_url} style={styles.sidebarLink}>
                  LinkedIn Profile
                </Link>
              )}
              {resume.portfolio_url && (
                <Link src={resume.portfolio_url} style={styles.sidebarLink}>
                  Portfolio
                </Link>
              )}
              {resume.github_url && (
                <Link src={resume.github_url} style={styles.sidebarLink}>
                  GitHub
                </Link>
              )}
            </View>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {Array.isArray(resume.skills) && typeof resume.skills[0] === 'string' ? (
                (resume.skills as string[]).map((skill, index) => (
                  <Text key={index} style={styles.sidebarItem}>• {skill}</Text>
                ))
              ) : (
                (resume.skills as SkillCategory[]).map((skillCat, index) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={[styles.sidebarText, { fontWeight: 'bold', marginBottom: 3 }]}>
                      {skillCat.category}
                    </Text>
                    {skillCat.skills.map((skill, i) => (
                      <Text key={i} style={styles.sidebarItem}>• {skill}</Text>
                    ))}
                  </View>
                ))
              )}
            </View>
          )}

          {/* Languages */}
          {resume.communication_languages && resume.communication_languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Languages</Text>
              {resume.communication_languages.map((lang, index) => (
                <Text key={index} style={styles.sidebarItem}>• {lang}</Text>
              ))}
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

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Work Experience</Text>
              {resume.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </Text>
                    <Text style={styles.date}>
                      {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
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
                    {formatDate(edu.start_date)} - {edu.current ? 'Present' : formatDate(edu.end_date)}
                    {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                  </Text>
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
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.technologies}>
                      Technologies: {project.technologies.join(', ')}
                    </Text>
                  )}
                  {project.url && (
                    <Link src={project.url} style={[styles.sidebarLink, { color: '#0f766e' }]}>
                      View Project
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certificates */}
          {resume.certificates && resume.certificates.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Certifications</Text>
              {resume.certificates.map((cert, index) => (
                <Text key={index} style={styles.bulletPoint}>• {cert}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
