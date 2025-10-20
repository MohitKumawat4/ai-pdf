# PDF Template Dynamic Styling - Update Instructions

All PDF templates need to be updated to support dynamic styling. Here's the pattern:

## 1. Add Imports
```typescript
import type { PDFStyleSettings } from '@/types/pdf-styles';
import { getPDFFont } from '@/types/pdf-styles';
```

## 2. Convert Static Styles to Dynamic Function
```typescript
// OLD:
const styles = StyleSheet.create({ ... });

// NEW:
const createStyles = (styleSettings?: PDFStyleSettings) => {
  const font = styleSettings?.fontFamily ? getPDFFont(styleSettings.fontFamily) : 'Helvetica';
  const accentColor = styleSettings?.accentColor || '#DEFAULT';
  const pageBackground = styleSettings?.pageBackground || '#ffffff';
  const textColor = styleSettings?.textColor || '#000000';

  return StyleSheet.create({
    // Use variables: font, accentColor, pageBackground, textColor
  });
};
```

## 3. Update Props Interface
```typescript
interface TemplatePDFProps {
  resume: Resume;
  styles?: PDFStyleSettings;  // ADD THIS
}
```

## 4. Update Component
```typescript
export function TemplatePDF({ resume, styles: styleSettings }: TemplatePDFProps) {
  const styles = createStyles(styleSettings);  // ADD THIS
  // ... rest of component
}
```

## Color Replacement Rules:
- Main text: Use `textColor` 
- Accent elements (headings, borders): Use `accentColor`
- Background: Use `pageBackground`
- For secondary text: Use `textColor` with `opacity: 0.7`
- For tertiary text: Use `textColor` with `opacity: 0.6`

