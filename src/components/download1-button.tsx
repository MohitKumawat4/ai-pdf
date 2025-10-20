"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import type { Resume } from "@/types/resume";

interface Download1ButtonProps {
  resume: Resume;
  templateRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function Download1Button({ resume, templateRef, className }: Download1ButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!templateRef.current) {
      console.error("Template ref not available");
      return;
    }

    setIsGenerating(true);

    try {
      const element = templateRef.current;

      // Extract all links before converting to image
      const links: Array<{ href: string; rect: DOMRect; element: HTMLAnchorElement }> = [];
      const anchorElements = element.querySelectorAll("a[href]");

      anchorElements.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (href) {
          const rect = anchor.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          // Calculate position relative to the template element
          const relativeRect = new DOMRect(
            rect.left - elementRect.left,
            rect.top - elementRect.top,
            rect.width,
            rect.height
          );

          links.push({
            href,
            rect: relativeRect,
            element: anchor as HTMLAnchorElement,
          });
        }
      });

      // Use html-to-image which handles modern CSS better
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: false,
        style: {
          // Override any problematic styles
          transform: "none",
        },
      });

      // Create image from data URL
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate scaling to fit A4
      const imgWidth = a4Width;
      const imgHeight = (img.height * imgWidth) / img.width;

      // Get the scale factor for converting pixel positions to PDF coordinates
      const elementWidth = element.offsetWidth;
      const scaleFactor = imgWidth / elementWidth;

      // Add image to PDF
      if (imgHeight <= a4Height) {
        // Fits on one page
        pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);

        // Add clickable links as annotations
        links.forEach((link) => {
          const x = link.rect.left * scaleFactor;
          const y = link.rect.top * scaleFactor;
          const width = link.rect.width * scaleFactor;
          const height = link.rect.height * scaleFactor;

          pdf.link(x, y, width, height, { url: link.href });
        });
      } else {
        // Need multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        let pageNumber = 0;

        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);

        // Add links for first page
        links.forEach((link) => {
          const x = link.rect.left * scaleFactor;
          const y = link.rect.top * scaleFactor;
          const width = link.rect.width * scaleFactor;
          const height = link.rect.height * scaleFactor;

          // Only add link if it's on the current page
          if (y >= 0 && y < a4Height) {
            pdf.link(x, y, width, height, { url: link.href });
          }
        });

        heightLeft -= a4Height;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pageNumber++;
          pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);

          // Add links for this page
          const pageStartY = pageNumber * a4Height;
          links.forEach((link) => {
            const x = link.rect.left * scaleFactor;
            const y = link.rect.top * scaleFactor - pageStartY;
            const width = link.rect.width * scaleFactor;
            const height = link.rect.height * scaleFactor;

            // Only add link if it's on the current page
            if (y >= 0 && y < a4Height) {
              pdf.link(x, y, width, height, { url: link.href });
            }
          });

          heightLeft -= a4Height;
        }
      }

      // Download the PDF
      const fileName = `${resume.full_name.replace(/\s+/g, "_")}_Resume_Download1.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      if (errorMessage.includes("network") || errorMessage.includes("CORS")) {
        alert("Failed to load external resources. Please check your internet connection and ensure all images are accessible.");
      } else if (errorMessage.includes("timeout")) {
        alert("PDF generation timed out. The resume might be too complex. Please try simplifying the template.");
      } else {
        alert(`Failed to generate PDF.\n\nError: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download 1
        </>
      )}
    </Button>
  );
}
