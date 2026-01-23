# Release Notes

This document tracks the major features and improvements to the Map Location Keys extension for Owlbear Rodeo.

## 2026-01-23

### Player Experience Enhancements

- **Player Editing**: Players can now edit location information directly through the player view, allowing them to add their own notes and observations to shared location keys
- **Player Context Menu**: Added "Reveal Location Key" context menu option for players, enabling them to quickly navigate to and view visible location keys on the map
- **Larger Window Size**: Increased extension popover dimensions from 600x600 to 800x800 pixels, reducing scrolling and improving content visibility for both GMs and players

### Technical Improvements

- **Edit Mode UI**: Implemented toggle-based edit mode in player view with save/cancel functionality and form validation
- **Analytics Tracking**: Added player-specific analytics events for editing and revealing location keys
- **Context Menu Filtering**: Enhanced context menu system with role-based filtering to ensure players only see reveal options for visible location keys

## 2025-11-24

### UI/UX Improvements

- **Tab-Based Navigation**: Replaced dropdown navbar with horizontal tab navigation for improved accessibility and reduced vertical space usage
- **Compact Layout**: Removed redundant "Existing Location Keys" heading and reduced accordion vertical padding throughout the interface
- **Visual Hierarchy**: Streamlined location key list view with tighter spacing for better content density

## 2025-11-10

### Fog Export/Import Enhancements

- **CURVE Type Support**: Extended fog export/import to support CURVE type items (drawn polygons and freeform shapes), in addition to existing SHAPE and PATH support
- **Complete Item Type Coverage**: Fog export now correctly handles all three fog drawing types (SHAPE for rectangles/circles/triangles/hexagons, PATH for custom paths, CURVE for drawn polygons)
- **Metadata Preservation**: Fog export/import now preserves all item metadata, including Dynamic Fog extension data (doors with open/closed states, light configurations)
- **Cross-Extension Compatibility**: Full support for exporting and importing fog setups created with the Dynamic Fog extension, preserving door positions, states, and light source configurations

### Bug Fixes

- **Tension Property Handling**: Fixed CURVE item import by correctly placing the tension property within the style object to match OBR SDK validation requirements
- **Item Detection**: Resolved issue where only 5 of 24 fog items were being detected due to missing CURVE type filtering

## 2025-11-08

### Fog Export/Import

- **Fog Layer Support**: Added comprehensive fog layer export/import functionality with support for both SHAPE and PATH fog items
- **Fog Preservation**: Export fog items as YAML preserving all styling (fill/stroke colors, opacity, width, dash patterns), geometry (width, height, shape type, path commands), position coordinates, and visibility state
- **Automatic Cleanup**: Import automatically removes existing fog layer items before restoring from YAML to prevent duplicates
- **Shape Type Support**: Full support for fog drawing shapes (circle, rectangle, triangle, hexagon) and custom path-based fog

### Location Key Enhancements

- **Position Preservation**: Export/import now preserves exact position coordinates of location keys on the map
- **Text Styling Persistence**: Save and restore all text styling properties including font family, size, weight, colors (fill/stroke), opacity, alignment (horizontal/vertical), line height, and padding
- **Text Dimensions**: Preserve text box width and height settings during export/import
- **Visibility Control**: Added "import as hidden" checkbox to control OBR scene visibility when importing location keys
- **Complete Restoration**: All exports now maintain exact visual appearance and positioning for seamless backup/restore workflows

### Documentation

- **Comprehensive Architecture Guide**: Major update to CLAUDE.md with detailed documentation covering initialization lifecycle, state management patterns, role-based routing, component hierarchy, complete data models, performance optimizations, analytics integration, and full OBR SDK reference

## 2025-09-14

### Import/Export Improvements

- **Staircase Layout**: Implemented intelligent staircase positioning for imported location keys, replacing linear horizontal layout with 2D distribution that reduces visual clutter and scales efficiently for large datasets
- **Chunked Import Processing**: Enhanced import functionality with batch processing to handle large location key sets (50+ items) without exceeding OBR update size limits
- **Progress Indicators**: Added real-time import progress feedback with batch status and improved error handling

### Documentation

- **Release Notes**: Added comprehensive RELEASE-NOTES.md documenting all major features and improvements from the past year

## 2025-09-12

### UI/UX Improvements

- **Code Refactoring**: Consolidated "Buy Me A Coffee" section in LocationKeys component for improved readability
- **Component Cleanup**: Refactored LocationKeys component for improved code readability and consistency
- **Layout Adjustments**: Removed redundant "Information for Players" section from Help component and adjusted layout spacing in LocationKey and LocationKeys components

## 2025-09-02

### Markdown Rendering Upgrade

- **Enhanced Markdown Support**: Replaced remarkable-react with react-markdown and added improved markdown styling for better location key description rendering

## 2025-08-25

### Player Features

- **Player Visibility Control**: Added player visibility feature for location keys, allowing GMs to control which location keys are visible to players

## 2025-07-24

### Bug Fixes & Documentation

- **Line Break Fix**: Fixed issue where location names with line breaks were not displaying fully
- **Development Documentation**: Added CLAUDE.md with comprehensive development guidance for contributors

## 2025-04-03

### Social Integration

- **Social Links**: Added FontAwesome icons and links to social profiles in Help component
- **Version Management**: Updated version tracking in manifest and package files

## Security & Maintenance Updates

Throughout 2024-2025, the project received regular security updates including:

### 2025 Dependency Updates

- **September 2025**: Vite security updates
- **May 2025**: Vite security updates
- **April 2025**: Vite security updates
- **March 2025**: Multiple Babel runtime and helpers updates, Vite updates
- **February 2025**: Vite security updates

### 2024 Dependency Updates

- **December 2024**: Nanoid security updates
- **September 2024**: Rollup and Vite security updates

---

*This extension helps Game Masters add interactive location keys to TEXT and PROP items on maps in Owlbear Rodeo, with features for player visibility control, markdown rendering, and comprehensive location management.*
