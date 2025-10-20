# Dynamic PDF Styling Implementation

## 🎯 Problem Solved
Users can now customize fonts, colors, and styling in the preview page, and those exact styles will be applied to the downloaded PDF!

## ✅ What's Been Completed

### 1. Created Shared Type System
**File:** `src/types/pdf-styles.ts`
- `PDFStyleSettings` interface for style configuration
- `DEFAULT_PDF_STYLES` constant
- `FONT_FAMILY_MAP` for web-to-PDF font conversion
- `getPDFFont()` helper function

### 2. Updated PDF Download Button
**File:** `src/components/pdf-download-button.tsx`
- Now accepts `styleSettings` prop
- Passes user's custom styles to PDF API
- Logs style settings for debugging

### 3. Updated PDF API Route
**File:** `src/app/api/generate-pdf/route.ts`
- Accepts `styleSettings` in request body
- Passes styles to all PDF template components
- Falls back to defaults if no styles provided

### 4. Updated Preview Page
**File:** `src/app/resume/[id]/preview/page.tsx`
- Passes current `styleSettings` and `accentStrength` to PDFDownloadButton
- User's customizations now flow through to PDF generation

### 5. Updated Elegant PDF Template ✅ COMPLETE
**File:** `src/components/pdf-templates/elegant-pdf.tsx`
- Converted to dynamic styling system
- Uses `createStyles()` function with style parameters
- Applies custom fonts, colors, and backgrounds
- Fully working with user customizations!

## ⚠️ What Still Needs To Be Done

The following PDF templates need the same updates as Elegant PDF:

### Templates to Update:
1. **Slate PDF** (`src/components/pdf-templates/slate-pdf.tsx`)
2. **Classic PDF** (`src/components/pdf-templates/classic-pdf.tsx`)
3. **Modern PDF** (`src/components/pdf-templates/modern-pdf.tsx`)
4. **Minimal PDF** (`src/components/pdf-templates/minimal-pdf.tsx`)
5. **Emerald PDF** (`src/components/pdf-templates/emerald-pdf.tsx`)
6. **Professional PDF** (`src/components/pdf-templates/professional-pdf.tsx`)

## 📋 Step-by-Step Update Pattern

For each template file, follow these steps:

### Step 1: Add Imports
```typescript
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';
```

### Step 2: Convert Styles to Dynamic Function
```typescript
// BEFORE:
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    // ...
  },
});

// AFTER:
const createStyles = (styleSettings?: PDFStyleSettings) => {
  // Extract style variables with defaults
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#111827';  // Use template's default
  const pageBackground = styleSettings?.pageBackground || '#ffffff';
  const textColor = styleSettings?.textColor || '#000000';

  return StyleSheet.create({
    page: {
      fontFamily: font,  // ← Use variable
      backgroundColor: pageBackground,  // ← Use variable
      // ...
    },
    // Replace all hardcoded colors with variables
  });
};
```

### Step 3: Update Props Interface
```typescript
// BEFORE:
interface TemplatePDFProps {
  resume: Resume;
}

// AFTER:
interface TemplatePDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;  // ← Add this
}
```

### Step 4: Update Component Function
```typescript
// BEFORE:
export function TemplatePDF({ resume }: TemplatePDFProps) {
  // component body
}

// AFTER:
export function TemplatePDF({ resume, styles: styleSettings }: TemplatePDFProps) {
  const styles = createStyles(styleSettings);  // ← Add this line
  // rest of component body (no other changes needed!)
}
```

### Step 5: Replace Hardcoded Colors

In the `createStyles()` function, replace all color references:

| Element Type | Old Value | New Value |
|--------------|-----------|-----------|
| Main text | `'#000000'` or `'#111827'` | `textColor` |
| Headings/Titles | `'#000000'` or template accent | `textColor` |
| Accent elements | Template-specific color | `accentColor` |
| Background | `'#ffffff'` or template background | `pageBackground` |
| Secondary text | `'#666666'` etc. | `textColor` with `opacity: 0.7` |
| Tertiary/muted text | `'#999999'` etc. | `textColor` with `opacity: 0.6` |
| Links | Template accent | `accentColor` |
| Borders | Template accent | `accentColor` with opacity |

## 🧪 Testing After Updates

1. Start dev server: `npm run dev`
2. Go to a resume preview page: `/resume/[id]/preview`
3. Try different style presets (Noir, Skyline, Editorial, Verdant)
4. Customize individual colors and fonts
5. Download PDF for each template
6. Verify PDF matches the preview styling

## 📖 Example: Updating Classic PDF

Here's how to update `classic-pdf.tsx`:

```typescript
// 1. Add imports at top
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';

// 2. Replace const styles = StyleSheet.create({ with:
const createStyles = (styleSettings?: PDFStyleSettings) => {
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#000000';  // Classic uses black
  const pageBackground = styleSettings?.pageBackground || '#ffffff';
  const textColor = styleSettings?.textColor || '#000000';

  return StyleSheet.create({
    page: {
      fontSize: 10,
      fontFamily: font,  // ← Changed
      backgroundColor: pageBackground,  // ← Changed
      padding: 40,
    },
    header: {
      borderBottom: `2 solid ${accentColor}`,  // ← Changed
      paddingBottom: 10,
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textColor,  // ← Changed
    },
    // ... continue for all styles
  });
};

// 3. Update interface
interface ClassicPDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;  // ← Add
}

// 4. Update component
export function ClassicPDF({ resume, styles: styleSettings }: ClassicPDFProps) {
  const styles = createStyles(styleSettings);  // ← Add
  // ... rest of component unchanged
}
```

## 🎨 Color Opacity Pattern

For consistent visual hierarchy, use these opacity levels with `textColor`:

```typescript
{
  // Primary headings
  mainTitle: {
    color: textColor,
    // No opacity - full strength
  },

  // Body text, secondary headings
  bodyText: {
    color: textColor,
    opacity: 0.85,
  },

  // Supporting text (companies, dates)
  supportingText: {
    color: textColor,
    opacity: 0.7,
  },

  // Metadata, labels
  metadata: {
    color: textColor,
    opacity: 0.6,
  },

  // Very subtle elements
  subtle: {
    color: textColor,
    opacity: 0.5,
  },
}
```

## 🚀 Benefits

Once all templates are updated:

✅ **User Customization:** Users can fully personalize their PDFs
✅ **Brand Consistency:** Match company colors and fonts
✅ **Preview Accuracy:** WYSIWYG - what you see is what you get
✅ **Professional Output:** Polished PDFs matching user preferences
✅ **Accessibility:** Users can choose high-contrast color schemes

## 🔧 Troubleshooting

### PDF doesn't reflect style changes
- Check browser console for style settings being logged
- Verify template has been updated with `createStyles()` function
- Ensure props interface includes `styles?: PDFStyleSettings`

### Fonts don't match preview
- Remember: Web fonts are mapped to PDF-compatible fonts
- Check `FONT_FAMILY_MAP` in `pdf-styles.ts`
- PDF renderer only supports: Helvetica, Times-Roman, Courier

### Colors look different
- PDF opacity rendering may differ slightly from CSS
- Test with various color combinations
- Consider adding color adjustment logic if needed

## 📝 Notes

- The Elegant PDF template is already complete and can be used as a reference
- All templates follow the same pattern for consistency
- The infrastructure is 100% ready - just need to update remaining templates
- Each template update takes about 10-15 minutes following the pattern
