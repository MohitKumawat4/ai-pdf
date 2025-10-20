import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import type { Resume, SkillCategory } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';

/**
 * Modern Spotlight PDF Template
 * Hero header with gradient background, profile picture, and two-column layout
 * Matches the preview design exactly!
 */

const createStyles = (styleSettings?: PDFStyleSettings) => {
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#18181b'; // zinc-900
  const pageBackground = styleSettings?.pageBackground || '#ffffff';
  const textColor = styleSettings?.textColor || '#000000';

  return StyleSheet.create({
    page: {
      fontSize: 10,
      fontFamily: font,
      backgroundColor: pageBackground,
    },
    // Hero Header Section
    heroHeader: {
      backgroundColor: accentColor,
      padding: '25 20',
      marginBottom: 20,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flex: 1,
      paddingRight: 15,
    },
    headerRight: {
      alignItems: 'center',
      gap: 10,
    },
    spotlightLabel: {
      fontSize: 7,
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 5,
    },
    heroName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 10,
      letterSpacing: 0.5,
    },
    heroContactContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 12,
    },
    heroContactItem: {
      fontSize: 8,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    heroLink: {
      fontSize: 8,
      color: 'rgba(255, 255, 255, 0.9)',
      textDecoration: 'none',
    },
    heroSummary: {
      fontSize: 9,
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: 8,
    },
    // Profile Picture
    profilePictureContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      overflow: 'hidden',
      border: '2 solid rgba(255, 255, 255, 0.4)',
      marginBottom: 8,
    },
    profilePicture: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    profilePlaceholder: {
      width: 70,
      height: 70,
      borderRadius: 35,
      border: '2 dashed rgba(255, 255, 255, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    placeholderText: {
      fontSize: 7,
      color: 'rgba(255, 255, 255, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    socialLinksContainer: {
      flexDirection: 'column',
      gap: 4,
    },
    socialLink: {
      fontSize: 7,
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
    },
    // Two-Column Content Layout
    contentContainer: {
      flexDirection: 'row',
      padding: '0 20',
      gap: 15,
    },
    leftColumn: {
      flex: 1.2,
      paddingRight: 10,
    },
    rightColumn: {
      flex: 0.8,
    },
    // Section Styles
    section: {
      marginBottom: 18,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottom: `2 solid ${accentColor}`,
      paddingBottom: 4,
    },
    // Card Styles (for sidebar)
    card: {
      backgroundColor: '#fafafa',
      border: `1 solid ${accentColor}`,
      borderRadius: 6,
      padding: 12,
      marginBottom: 12,
      opacity: 0.95,
    },
    cardTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    cardContent: {
      fontSize: 9,
      color: textColor,
      opacity: 0.85,
      lineHeight: 1.4,
    },
    // Experience Items
    experienceItem: {
      marginBottom: 14,
    },
    experienceHeader: {
      marginBottom: 6,
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 3,
    },
    company: {
      fontSize: 10,
      color: textColor,
      opacity: 0.75,
      marginBottom: 2,
    },
    date: {
      fontSize: 8,
      color: textColor,
      opacity: 0.6,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    description: {
      fontSize: 9,
      lineHeight: 1.5,
      color: textColor,
      opacity: 0.8,
      marginTop: 4,
    },
    bulletPoint: {
      fontSize: 9,
      lineHeight: 1.5,
      color: textColor,
      opacity: 0.8,
      marginLeft: 12,
      marginTop: 3,
    },
    // Project Items
    projectItem: {
      marginBottom: 14,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
    },
    projectTech: {
      fontSize: 8,
      color: textColor,
      opacity: 0.6,
      fontStyle: 'italic',
      marginTop: 3,
    },
    // Education Items
    educationItem: {
      marginBottom: 10,
    },
    degree: {
      fontSize: 10,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 3,
    },
    institution: {
      fontSize: 9,
      color: textColor,
      opacity: 0.75,
      marginBottom: 2,
    },
    eduDate: {
      fontSize: 8,
      color: textColor,
      opacity: 0.6,
      marginTop: 2,
    },
    // Skills
    skillsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillBadge: {
      fontSize: 8,
      color: textColor,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      padding: '4 8',
      borderRadius: 4,
    },
    // List items
    listItem: {
      fontSize: 9,
      color: textColor,
      opacity: 0.85,
      marginBottom: 4,
    },
    link: {
      color: accentColor,
      textDecoration: 'underline',
    },
  });
};

interface ModernPDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;
}

export const ModernPDF = ({ resume, styles: styleSettings }: ModernPDFProps) => {
  const styles = createStyles(styleSettings);

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate?: string, endDate?: string, current?: boolean) => {
    if (!startDate) return '';
    const start = formatDate(startDate);
    if (current) return `${start} - Present`;
    const end = formatDate(endDate);
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
        {/* Hero Header Section */}
        <View style={styles.heroHeader}>
          <View style={styles.headerContent}>
            {/* Left Side - Name and Info */}
            <View style={styles.headerLeft}>
              <Text style={styles.spotlightLabel}>Modern Spotlight</Text>
              <Text style={styles.heroName}>{resume.full_name}</Text>

              {/* Contact Info */}
              <View style={styles.heroContactContainer}>
                {resume.email && (
                  <Link src={`mailto:${resume.email}`} style={styles.heroLink}>
                    {resume.email}
                  </Link>
                )}
                {resume.contact_number && (
                  <Link src={`tel:${resume.contact_number}`} style={styles.heroLink}>
                    {resume.contact_number}
                  </Link>
                )}
                {resume.address && (
                  <Text style={styles.heroContactItem}>{resume.address}</Text>
                )}
              </View>

              {/* Professional Summary in Header */}
              {resume.professional_summary && (
                <Text style={styles.heroSummary}>{resume.professional_summary}</Text>
              )}
            </View>

            {/* Right Side - Profile Picture and Social Links */}
            <View style={styles.headerRight}>
              {/* Profile Picture */}
              {resume.profile_picture ? (
                <View style={styles.profilePictureContainer}>
                  <Image
                    src={resume.profile_picture}
                    style={styles.profilePicture}
                  />
                </View>
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.placeholderText}>Photo</Text>
                </View>
              )}

              {/* Social Links */}
              <View style={styles.socialLinksContainer}>
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
            </View>
          </View>
        </View>

        {/* Two-Column Content Layout */}
        <View style={styles.contentContainer}>
          {/* Left Column - Experience and Projects */}
          <View style={styles.leftColumn}>
            {/* Work Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {resume.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.jobTitle}>{exp.position}</Text>
                      <Text style={styles.company}>
                        {exp.company}{exp.location ? ` - ${exp.location}` : ''}
                      </Text>
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
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {resume.projects.map((project, index) => (
                  <View key={index} style={styles.projectItem}>
                    {project.url ? (
                      <Link src={project.url} style={[styles.projectTitle, styles.link]}>
                        {project.title}
                      </Link>
                    ) : (
                      <Text style={styles.projectTitle}>{project.title}</Text>
                    )}
                    {project.description && (
                      <Text style={styles.description}>{project.description}</Text>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <Text style={styles.projectTech}>
                        Technologies: {project.technologies.join(', ')}
                      </Text>
                    )}
                    {project.highlights && project.highlights.map((highlight, i) => (
                      <Text key={i} style={styles.bulletPoint}>• {highlight}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column - Education, Skills, Languages (Card-Based) */}
          <View style={styles.rightColumn}>
            {/* Education Card */}
            {resume.education && resume.education.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Education</Text>
                {resume.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.degree}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={styles.institution}>{edu.institution}</Text>
                    <Text style={styles.eduDate}>
                      {formatDateRange(edu.start_date, edu.end_date, edu.current)}
                    </Text>
                    {edu.gpa && (
                      <Text style={styles.eduDate}>GPA: {edu.gpa}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Skills Card */}
            {skillsList.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Skills</Text>
                <View style={styles.skillsList}>
                  {skillsList.map((skill, index) => (
                    <Text key={index} style={styles.skillBadge}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Languages Card */}
            {resume.communication_languages && resume.communication_languages.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Languages</Text>
                <Text style={styles.cardContent}>
                  {resume.communication_languages.join(', ')}
                </Text>
              </View>
            )}

            {/* Highlights/Awards Card */}
            {resume.awards && resume.awards.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Highlights</Text>
                {resume.awards.slice(0, 3).map((award, index) => (
                  <Text key={index} style={styles.listItem}>• {award.title}</Text>
                ))}
              </View>
            )}

            {/* Certifications Card */}
            {resume.certificates && resume.certificates.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Certifications</Text>
                {resume.certificates.slice(0, 4).map((cert, index) => (
                  <Text key={index} style={styles.listItem}>• {cert}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
