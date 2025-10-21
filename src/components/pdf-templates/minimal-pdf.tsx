import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume, SkillCategory } from '@/types/resume';

/**
 * Minimal PDF Template
 * Clean, minimalist design with lots of whitespace
 */

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'normal',
    marginBottom: 12,
    color: '#000000',
    letterSpacing: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
  },
  link: {
    color: '#000000',
    textDecoration: 'none',
  },
  section: {
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.8,
    color: '#333333',
    textAlign: 'left',
  },
  experienceItem: {
    marginBottom: 18,
  },
  experienceHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  company: {
    fontSize: 10,
    color: '#666666',
  },
  date: {
    fontSize: 9,
    color: '#999999',
    marginTop: 2,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#666666',
    marginTop: 6,
  },
  bulletPoint: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#666666',
    marginLeft: 15,
    marginTop: 3,
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  skillItem: {
    fontSize: 9,
    color: '#666666',
  },
  educationItem: {
    marginBottom: 15,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  institution: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  projectItem: {
    marginBottom: 18,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  technologies: {
    fontSize: 9,
    color: '#999999',
    marginTop: 3,
  },
});

interface MinimalPDFProps {
  resume: Resume;
}

export const MinimalPDF = ({ resume }: MinimalPDFProps) => {
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.full_name.toUpperCase()}</Text>
          <View style={styles.contactInfo}>
            {resume.email && (
              <Link src={`mailto:${resume.email}`} style={[styles.contactItem, styles.link]}>
                {resume.email}
              </Link>
            )}
            {resume.contact_number && (
              <Link src={`tel:${resume.contact_number}`} style={[styles.contactItem, styles.link]}>
                {resume.contact_number}
              </Link>
            )}
            {resume.address && (
              <Text style={styles.contactItem}>{resume.address}</Text>
            )}
          </View>
          <View style={[styles.contactInfo, { marginTop: 5 }]}>
            {resume.linkedin_url && (
              <Link src={resume.linkedin_url} style={[styles.contactItem, styles.link]}>
                LinkedIn
              </Link>
            )}
            {resume.portfolio_url && (
              <Link src={resume.portfolio_url} style={[styles.contactItem, styles.link]}>
                Portfolio
              </Link>
            )}
            {resume.github_url && (
              <Link src={resume.github_url} style={[styles.contactItem, styles.link]}>
                GitHub
              </Link>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {resume.professional_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.summary}>{resume.professional_summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.company}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
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

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Array.isArray(resume.skills) && typeof resume.skills[0] === 'string' ? (
              <Text style={styles.description}>{(resume.skills as string[]).join(' · ')}</Text>
            ) : (
              (resume.skills as SkillCategory[]).map((skillCat, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>{skillCat.category}</Text>
                  <Text style={styles.skillItem}>{skillCat.skills.join(' · ')}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.description}>{project.description}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.technologies}>
                    {project.technologies.join(' · ')}
                  </Text>
                )}
                {project.url && (
                  <Link src={project.url} style={[styles.contactItem, styles.link]}>
                    {project.url}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
