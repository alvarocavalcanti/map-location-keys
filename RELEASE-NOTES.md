# Release Notes

## Version 2026-02-04

### Major Tech Stack Modernization

**Complete migration from Bootstrap to Tailwind CSS** resulting in significant performance improvements.

#### Performance Improvements

- **Bundle Size Reduction**: 24% smaller total bundle
  - CSS: 235.98 KB → 15.10 KB (93.6% reduction)
  - JavaScript: 581.83 KB → 524.34 KB (9.9% reduction)
  - Total (gzipped): 212.63 KB → 162.70 KB (23.5% reduction)
- **Module Optimization**: 48% fewer modules transformed (656 → 342)
- **Dependencies**: Reduced from 29 to 26 packages

#### Technical Changes

- Replaced Bootstrap 5 + react-bootstrap with Tailwind CSS v4
- Replaced analytics wrapper packages with direct gtag.js integration
- Converted all Bootstrap Accordions to custom Tailwind collapsible components
- Maintained all existing functionality with improved performance
- Enhanced dark mode support with better color contrast
- Cleaner, more maintainable component code

#### Visual Improvements

- Improved text readability in both light and dark modes
- Better color contrast throughout the UI
- Consistent styling with Owlbear Rodeo theme
- Smoother hover states and transitions
- Custom collapsible sections with animated chevron icons
- Responsive grid layouts for buttons and controls

---
