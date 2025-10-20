import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume, SkillCategory } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';

/**
 * Slate PDF Template
 * Professional muted tones with card-based sections
 * Now supports dynamic styling!
 */

const createStyles = (styleSettings?: PDFStyleSettings) => {
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#7c859a';
  const pageBackground = styleSettings?.pageBackground || '#f5f7fb';
  const textColor = styleSettings?.textColor || '#2b2f38';

  return StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: font,
    backgroundColor: pageBackground,
    padding: 40,
  },
  // Header Card
  header: {
    backgroundColor: '#ffffff',
    padding: '30 40',
    marginBottom: 20,
    border: `1 solid ${accentColor}`,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 8,
    color: textColor,
    opacity: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 9,
    color: textColor,
    opacity: 0.8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  socialLink: {
    fontSize: 8,
    color: accentColor,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginHorizontal: 6,
    textDecoration: 'none',
  },
  // Section Cards
  sectionCard: {
    backgroundColor: '#ffffff',
    border: `1 solid ${accentColor}`,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: accentColor,
    opacity: 0.15,
    padding: '8 20',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: textColor,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionContent: {
    padding: '20 24',
  },
  // Content Styles
  paragraph: {
    fontSize: 9,
    lineHeight: 1.6,
    color: textColor,
  },
  // Experience/Education Items
  itemContainer: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: textColor,
  },
  itemSubtitle: {
    fontSize: 9,
    color: textColor,
    opacity: 0.75,
    marginTop: 2,
  },
  itemDate: {
    fontSize: 8,
    color: accentColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemLocation: {
    fontSize: 8,
    color: textColor,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.8,
    marginTop: 6,
  },
  bulletPoint: {
    fontSize: 9,
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.8,
    marginLeft: 12,
    marginTop: 3,
  },
  // Skills Grid
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  skillBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: accentColor,
    marginRight: 8,
  },
  skillText: {
    fontSize: 9,
    color: textColor,
    opacity: 0.8,
  },
  link: {
    color: accentColor,
    textDecoration: 'underline',
  },
  });
};

interface SlatePDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;
}

export function SlatePDF({ resume, styles: styleSettings }: SlatePDFProps) {
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
        {/* Header Card */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.full_name || 'Your Name'}</Text>
          <Text style={styles.subtitle}>
            {resume.professional_summary ? 'Professional Summary' : 'Entry-Level Resume'}
          </Text>

          {/* Contact Information */}
          <View style={styles.contactContainer}>
            {resume.email && (
              <Link src={`mailto:${resume.email}`} style={styles.contactItem}>
                {resume.email}
              </Link>
            )}
            {resume.contact_number && (
              <Text style={styles.contactItem}>{resume.contact_number}</Text>
            )}
            {resume.address && (
              <Text style={styles.contactItem}>{resume.address}</Text>
            )}
          </View>

          {/* Social Links */}
          {(resume.linkedin_url || resume.github_url || resume.portfolio_url) && (
            <View style={styles.socialContainer}>
              {resume.linkedin_url && (
                <Link src={resume.linkedin_url} style={styles.socialLink}>
                  LinkedIn
                </Link>
              )}
              {resume.github_url && (
                <Link src={resume.github_url} style={styles.socialLink}>
                  GitHub
                </Link>
              )}
              {resume.portfolio_url && (
                <Link src={resume.portfolio_url} style={styles.socialLink}>
                  Portfolio
                </Link>
              )}
            </View>
          )}
        </View>

        {/* Summary Section */}
        {resume.professional_summary && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>{resume.professional_summary}</Text>
            </View>
          </View>
        )}

        {/* Education Section */}
        {resume.education && resume.education.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            <View style={styles.sectionContent}>
              {resume.education.map((edu, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.institution}{edu.location ? ` · ${edu.location}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.itemDate}>
                      {formatDateRange(edu.start_date, edu.end_date, edu.current)}
                    </Text>
                  </View>
                  {edu.gpa && (
                    <Text style={styles.itemSubtitle}>GPA: {edu.gpa}</Text>
                  )}
                  {edu.description && (
                    <Text style={styles.description}>{edu.description}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience Section */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Relevant Experience</Text>
            </View>
            <View style={styles.sectionContent}>
              {resume.experience.map((exp, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>
                        {exp.position} · {exp.company}
                      </Text>
                      {exp.location && (
                        <Text style={styles.itemLocation}>{exp.location}</Text>
                      )}
                    </View>
                    <Text style={styles.itemDate}>
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
          </View>
        )}

        {/* Skills Section */}
        {skillsList.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Key Skills</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.skillsGrid}>
                {skillsList.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <View style={styles.skillBullet} />
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Projects Section */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Projects</Text>
            </View>
            <View style={styles.sectionContent}>
              {resume.projects.map((project, index) => (
                <View key={index} style={styles.itemContainer}>
                  {project.url ? (
                    <Link src={project.url} style={[styles.itemTitle, styles.link]}>
                      {project.title}
                    </Link>
                  ) : (
                    <Text style={styles.itemTitle}>{project.title}</Text>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.itemSubtitle}>
                      Tech: {project.technologies.join(', ')}
                    </Text>
                  )}
                  {project.description && (
                    <Text style={styles.description}>{project.description}</Text>
                  )}
                  {project.highlights && project.highlights.map((highlight, i) => (
                    <Text key={i} style={styles.bulletPoint}>• {highlight}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {resume.communication_languages && resume.communication_languages.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Languages</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                {resume.communication_languages.join(', ')}
              </Text>
            </View>
          </View>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>
            <View style={styles.sectionContent}>
              {resume.achievements.map((achievement, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={styles.bulletPoint}>
                    <Text style={{ fontWeight: 'bold' }}>{achievement.title}</Text>
                    {achievement.description ? ` – ${achievement.description}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Awards */}
        {resume.awards && resume.awards.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Awards</Text>
            </View>
            <View style={styles.sectionContent}>
              {resume.awards.map((award, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>{award.title}</Text>
                  <Text style={styles.itemSubtitle}>{award.issuer}</Text>
                  <Text style={styles.itemDate}>
                    {new Date(award.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                  {award.description && (
                    <Text style={styles.description}>{award.description}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hobbies & Interests */}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>{resume.hobbies.join(', ')}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
