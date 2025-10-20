import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Canvas-to-PDF Utility
 * Converts HTML DOM elements to PDF while preserving visual appearance
 * Uses html2canvas for rendering and jsPDF for PDF generation
 */

interface CanvasToPDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  useCORS?: boolean;
  backgroundColor?: string | null;
}

/**
 * Convert LAB/modern color formats to RGB
 * html2canvas doesn't support lab(), oklab(), lch(), oklch() color functions
 * This function converts them by creating a temporary element and reading computed RGB
 */
function convertColorToRGB(color: string): string {
  // If already a simple color format, return as-is
  if (color.startsWith('#') ||
      color.startsWith('rgb(') ||
      color.startsWith('rgba(') ||
      color === 'transparent' ||
      color === 'inherit' ||
      color === 'initial' ||
      color === 'unset') {
    return color;
  }

  // Create temporary element to compute color
  const tempEl = document.createElement('div');
  tempEl.style.color = color;
  tempEl.style.display = 'none';
  document.body.appendChild(tempEl);

  const computed = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  return computed || color;
}

/**
 * Convert gradient string with LAB colors to RGB-based gradient
 * Parses gradient and converts each color stop to RGB
 */
function convertGradientToRGB(gradientStr: string): string {
  // Match all color functions in the gradient
  const colorRegex = /(?:lab|lch|oklab|oklch|color)\([^)]+\)/gi;

  let convertedGradient = gradientStr;
  const matches = gradientStr.match(colorRegex);

  if (matches) {
    matches.forEach(colorFunc => {
      try {
        const rgb = convertColorToRGB(colorFunc);
        convertedGradient = convertedGradient.replace(colorFunc, rgb);
      } catch (e) {
        console.warn(`Failed to convert color: ${colorFunc}`, e);
      }
    });
  }

  return convertedGradient;
}

/**
 * Clone element and convert all LAB/modern colors to RGB
 * This ensures html2canvas can parse all colors
 */
function preprocessElementForCanvas(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;

  // Walk through all elements and convert colors
  const walk = (el: HTMLElement) => {
    try {
      const computed = window.getComputedStyle(el);

      // Handle background gradients (most common issue)
      const bgImage = computed.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        // Check if it contains modern color functions
        if (/(?:lab|lch|oklab|oklch|color)\(/i.test(bgImage)) {
          const convertedBg = convertGradientToRGB(bgImage);
          el.style.backgroundImage = convertedBg;
        }
      }

      // Handle solid colors
      const colorProps: Array<keyof CSSStyleDeclaration> = [
        'color',
        'backgroundColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
      ];

      colorProps.forEach(prop => {
        const value = computed[prop] as string;
        if (value && typeof value === 'string' && /(?:lab|lch|oklab|oklch|color)\(/i.test(value)) {
          try {
            const rgb = convertColorToRGB(value);
            (el.style as any)[prop] = rgb;
          } catch (e) {
            console.warn(`Failed to convert ${prop}:`, e);
          }
        }
      });

      // Recursively process children
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          walk(child);
        }
      });
    } catch (e) {
      console.warn('Error processing element:', e);
    }
  };

  walk(clone);
  return clone;
}

/**
 * Generate PDF from HTML element using canvas rendering
 * This approach captures the exact visual appearance including CSS gradients, shadows, etc.
 *
 * @param element - The DOM element to convert (usually the preview container)
 * @param options - Configuration options for PDF generation
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function generatePDFFromCanvas(
  element: HTMLElement,
  options: CanvasToPDFOptions = {}
): Promise<void> {
  const {
    filename = 'resume.pdf',
    quality = 0.95,
    scale = 2, // Higher scale = better quality
    useCORS = true,
    backgroundColor = '#ffffff'
  } = options;

  try {
    // Step 1: Preprocess element to convert LAB colors to RGB
    console.log('Preprocessing element to convert modern color formats...');
    const processedElement = preprocessElementForCanvas(element);

    // Temporarily add to DOM for html2canvas (hidden)
    processedElement.style.position = 'absolute';
    processedElement.style.left = '-9999px';
    processedElement.style.top = '0';
    document.body.appendChild(processedElement);

    // Step 2: Convert DOM element to canvas with high quality
    const canvas = await html2canvas(processedElement, {
      scale,
      useCORS,
      backgroundColor,
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      // Optimize for A4 page size (210mm x 297mm)
      width: processedElement.scrollWidth,
      height: processedElement.scrollHeight,
      windowWidth: processedElement.scrollWidth,
      windowHeight: processedElement.scrollHeight,
    });

    // Clean up cloned element
    document.body.removeChild(processedElement);

    // Step 2: Calculate PDF dimensions
    // A4 dimensions in mm: 210 x 297
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Calculate how many pages we need
    const pageHeight = 297;
    let heightLeft = imgHeight;
    let position = 0;

    // Step 3: Create PDF document
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Step 4: Convert canvas to image data
    const imgData = canvas.toDataURL('image/jpeg', quality);

    // Step 5: Add image to PDF (handle multi-page if needed)
    if (heightLeft <= pageHeight) {
      // Single page - simple case
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    } else {
      // Multi-page - split content across pages
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    // Step 6: Trigger download
    pdf.save(filename);

  } catch (error) {
    console.error('Error generating PDF from canvas:', error);

    // Provide helpful error message based on error type
    if (error instanceof Error) {
      if (error.message.includes('color') || error.message.includes('lab') || error.message.includes('lch')) {
        throw new Error('Color format issue detected. The template may use advanced color formats. Please try a different template or contact support.');
      }
    }

    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or use a different browser.`);
  }
}

/**
 * Generate PDF with text overlay for searchability
 * This preserves the visual appearance while adding invisible text layer
 * for PDF features like search, selection, and hyperlinks
 *
 * NOTE: This is a more advanced implementation that requires text positioning
 * Currently using simpler image-only approach, but can be enhanced later
 */
export async function generatePDFWithTextOverlay(
  element: HTMLElement,
  options: CanvasToPDFOptions = {}
): Promise<void> {
  // For now, use the simpler canvas-only approach
  // TODO: Implement text extraction and overlay for better PDF features
  return generatePDFFromCanvas(element, options);
}
