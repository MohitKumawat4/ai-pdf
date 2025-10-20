/**
 * PDF Style Settings Type
 * Shared type for customizing PDF appearance
 */

export interface PDFStyleSettings {
  fontFamily: string;
  accentColor: string;
  pageBackground: string;
  textColor: string;
  accentStrength?: number;
}

/**
 * Default style settings matching the preview defaults
 */
export const DEFAULT_PDF_STYLES: PDFStyleSettings = {
  fontFamily: 'Helvetica',  // @react-pdf/renderer uses Helvetica as default
  accentColor: '#111827',
  pageBackground: '#ffffff',
  textColor: '#0f172a',
  accentStrength: 70,
};

/**
 * Font family mapping from web fonts to PDF-compatible fonts
 * @react-pdf/renderer has limited font support
 */
export const FONT_FAMILY_MAP: Record<string, string> = {
  "'Plus Jakarta Sans', sans-serif": 'Helvetica',
  "'Inter', sans-serif": 'Helvetica',
  "'Sora', sans-serif": 'Helvetica',
  "'Space Grotesk', sans-serif": 'Helvetica',
  "'Playfair Display', serif": 'Times-Roman',
  'Helvetica': 'Helvetica',
  'Times-Roman': 'Times-Roman',
  'Courier': 'Courier',
};

/**
 * Get PDF-compatible font family from web font string
 */
export function getPDFFont(webFont: string): string {
  return FONT_FAMILY_MAP[webFont] || 'Helvetica';
}
