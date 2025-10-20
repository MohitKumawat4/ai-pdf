import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { ClassicPDF } from '@/components/pdf-templates/classic-pdf';
import { ModernPDF } from '@/components/pdf-templates/modern-pdf';
import { MinimalPDF } from '@/components/pdf-templates/minimal-pdf';
import { ProfessionalPDF } from '@/components/pdf-templates/professional-pdf';
import { EmeraldPDF } from '@/components/pdf-templates/emerald-pdf';
import { ElegantPDF } from '@/components/pdf-templates/elegant-pdf';
import { SlatePDF } from '@/components/pdf-templates/slate-pdf';
import type { Resume } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { DEFAULT_PDF_STYLES } from '@/types/pdf-styles';

/**
 * API Route for PDF Generation
 * Generates PDF on the server side to avoid client-side compatibility issues
 */

export async function POST(request: NextRequest) {
  try {
    const { resume, styleSettings } = await request.json() as {
      resume: Resume;
      styleSettings?: PDFStyleSettings;
    };

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Use provided style settings or fallback to defaults
    const styles = styleSettings || DEFAULT_PDF_STYLES;

    // Select the appropriate PDF template based on template_id
    const templateId = resume.template_id || 'classic';
    console.log('PDF Generation - Template ID:', templateId);
    console.log('PDF Generation - Resume ID:', resume.id);
    console.log('PDF Generation - Style Settings:', styles);
    let pdfElement;

    switch (templateId) {
      case 'modern':
        pdfElement = React.createElement(ModernPDF, { resume, styles });
        break;

      case 'minimal':
        pdfElement = React.createElement(MinimalPDF, { resume, styles });
        break;

      case 'professional':
      case 'creative':
      case 'executive':
        pdfElement = React.createElement(ProfessionalPDF, { resume, styles });
        break;

      case 'emerald':
        pdfElement = React.createElement(EmeraldPDF, { resume, styles });
        break;

      case 'elegant':
        pdfElement = React.createElement(ElegantPDF, { resume, styles });
        break;

      case 'slate':
        pdfElement = React.createElement(SlatePDF, { resume, styles });
        break;

      case 'classic':
      default:
        pdfElement = React.createElement(ClassicPDF, { resume, styles });
        break;
    }

    // Generate PDF stream and convert to buffer
    const stream = await ReactPDF.renderToStream(pdfElement);
    const chunks: Buffer[] = [];
    
    for await (const chunk of stream as any) {
      chunks.push(Buffer.from(chunk));
    }
    
    const buffer = Buffer.concat(chunks);

    // Generate filename
    const fileName = `${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`;

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
