"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Resume } from '@/types/resume';
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { generatePDFFromCanvas } from '@/lib/canvas-to-pdf';

/**
 * PDF Download Button Component
 * Uses canvas-to-PDF approach to capture exact visual appearance
 * Preserves CSS gradients, shadows, and all visual effects
 */

interface PDFDownloadButtonProps {
  resume: Resume;
  className?: string;
  styleSettings?: PDFStyleSettings;
  templateElement?: HTMLElement | null; // Reference to the preview element
}

export function PDFDownloadButton({ resume, className, styleSettings, templateElement }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      console.log('Download button - Resume template_id:', resume.template_id);
      console.log('Download button - Resume ID:', resume.id);
      console.log('Download button - Style settings:', styleSettings);

      // Find the preview element if not provided
      const element = templateElement || document.querySelector('[data-pdf-content]') as HTMLElement;

      if (!element) {
        throw new Error('Preview element not found. Please ensure the resume is visible.');
      }

      // Generate PDF from the visual preview using canvas
      await generatePDFFromCanvas(element, {
        filename: `${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`,
        quality: 0.95,
        scale: 2, // High quality for crisp text
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      console.log('PDF generated successfully from canvas');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </>
      )}
    </Button>
  );
}
