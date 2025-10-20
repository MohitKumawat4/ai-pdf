import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';

/**
 * Classic PDF Template
 * Professional and clean design for react-pdf/renderer
 * Now supports dynamic styling!
 */

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const mixColor = (hex: string, amount: number) => {
  const safeHex = /^#?[0-9A-Fa-f]{6}$/.test(hex) ? hex : '#222222';
  const normalized = safeHex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  const mix = (channel: number) => clamp(Math.round(channel + (255 - channel) * amount), 0, 255);
  const result = `#${[mix(r), mix(g), mix(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
  return result;
};

const createStyles = (styleSettings?: PDFStyleSettings) => {
  const fontFamily = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const textColor = styleSettings?.textColor ?? '#1f2933';
  const accentColor = styleSettings?.accentColor ?? '#0f172a';
  const secondaryText = styleSettings?.textColor ? mixColor(styleSettings.textColor, 0.35) : '#475569';
  const mutedText = styleSettings?.textColor ? mixColor(styleSettings.textColor, 0.6) : '#64748b';
  const pageBackground = styleSettings?.pageBackground ?? '#ffffff';

  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily,
      backgroundColor: pageBackground,
      color: textColor,
    },
    header: {
      marginBottom: 20,
      borderBottom: `2 solid ${accentColor}`,
      paddingBottom: 15,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: accentColor,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 8,
    },
    contactItem: {
      fontSize: 9,
      color: secondaryText,
      marginRight: 15,
    },
    link: {
      color: accentColor,
      textDecoration: 'none',
    },
    section: {
      marginTop: 15,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: accentColor,
      borderBottom: `1 solid ${mixColor(accentColor, 0.7)}`,
      paddingBottom: 4,
    },
    summary: {
      fontSize: 10,
      lineHeight: 1.5,
      color: secondaryText,
      textAlign: 'justify',
    },
    experienceItem: {
      marginBottom: 12,
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
    },
    company: {
      fontSize: 10,
      color: secondaryText,
      marginBottom: 2,
    },
    date: {
      fontSize: 9,
      color: mutedText,
    },
    description: {
      fontSize: 9,
      lineHeight: 1.4,
      color: secondaryText,
      marginTop: 4,
    },
    bulletPoint: {
      fontSize: 9,
      lineHeight: 1.4,
      color: secondaryText,
      marginLeft: 15,
      marginTop: 2,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skillCategory: {
      marginBottom: 8,
    },
    skillCategoryName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
    },
    skillItem: {
      fontSize: 9,
      color: secondaryText,
      marginLeft: 10,
    },
    educationItem: {
      marginBottom: 10,
    },
    degree: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
    },
    institution: {
      fontSize: 10,
      color: secondaryText,
      marginTop: 2,
    },
    projectItem: {
      marginBottom: 12,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
    },
    technologies: {
      fontSize: 9,
      color: mutedText,
      fontStyle: 'italic',
      marginTop: 2,
    },
  });
};

interface ClassicPDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;
}

export const ClassicPDF = ({ resume, styles: styleSettings }: ClassicPDFProps) => {
  const styles = createStyles(styleSettings);
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.full_name}</Text>
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
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{resume.professional_summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>{exp.company}{exp.location ? ` - ${exp.location}` : ''}</Text>
                  </View>
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
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                </Text>
                {edu.description && (
                  <Text style={styles.description}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Array.isArray(resume.skills) && typeof resume.skills[0] === 'string' ? (
              <Text style={styles.description}>{(resume.skills as string[]).join(', ')}</Text>
            ) : (
              (resume.skills as any[]).map((skillCat, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>{skillCat.category}:</Text>
                  <Text style={styles.skillItem}>{skillCat.skills.join(', ')}</Text>
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
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
                {project.url && (
                  <Link src={project.url} style={[styles.contactItem, styles.link]}>
                    View Project
                  </Link>
                )}
                {project.github_url && (
                  <Link src={project.github_url} style={[styles.contactItem, styles.link]}>
                    GitHub
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certificates */}
        {resume.certificates && resume.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certificates.map((cert, index) => (
              <Text key={index} style={styles.bulletPoint}>• {cert}</Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {resume.communication_languages && resume.communication_languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.description}>{resume.communication_languages.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
