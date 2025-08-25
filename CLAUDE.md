# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build locally

## Project Architecture

This is an Owlbear Rodeo extension that allows GMs to add location keys to TEXT and PROP items on maps. The extension provides a popover interface for managing these location keys.

### Core Structure

- **Owlbear Rodeo SDK Integration**: Uses `@owlbear-rodeo/sdk` for all map interactions
- **React SPA**: Single-page application with React Router for navigation
- **Context Menu System**: Adds right-click options to TEXT and PROP layer items for adding/removing location keys
- **Metadata Storage**: Location keys are stored in item metadata using the pattern `${ID}/metadata`

### Key Components

- `src/components/App.tsx` - Main app component that checks if Owlbear scene is ready
- `src/contextMenu.ts` - Defines context menu actions for adding/removing/revealing location keys
- `src/components/SPA.tsx` - Main single-page application routing
- `src/components/LocationKeys.tsx` - Main interface for managing location keys (GM view with visibility controls)
- `src/components/PlayerView.tsx` - Player interface showing only player-visible location keys
- `src/@types/types.d.ts` - TypeScript definitions for LocationKey interface with player info fields

### Extension Architecture

- **Manifest**: `public/manifest.json` defines the extension metadata and popover dimensions (400x600)
- **Context Menus**: Four context menu items for GM-only actions:
  - Add Location Key (for items without metadata)
  - Remove Location Key (for items with metadata)
  - Reveal Location Key (opens popover and broadcasts item ID)
  - Toggle Player Visibility (makes location key visible/hidden for players)
- **Broadcasting**: Uses OBR broadcast system to communicate between context menu and popover
- **Analytics**: Integrated with Vercel Analytics and Google Analytics for usage tracking

### Data Flow

1. GM right-clicks TEXT or PROP layer items to add location keys via context menu
2. Location keys stored as metadata on Owlbear items using template in `contextMenu.ts:6-16`
3. Popover interface allows editing location keys, player info, importing/exporting YAML, and navigation
4. GM can toggle player visibility via context menu or edit form
5. Broadcasting enables revealing specific location keys from context menu
6. Players see only location keys marked as player-visible with custom player information

### Dependencies

- **UI**: React + React Bootstrap for interface components
- **Routing**: React Router DOM for SPA navigation
- **Markdown**: Remarkable for rendering location key descriptions
- **File Operations**: file-saver and js-yaml for import/export functionality
- **Icons**: FontAwesome for UI icons

## Build System

- **Vite** with React plugin for development and building
- **TypeScript** with strict mode enabled and linting rules (noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch)
- No testing framework currently configured

## Versioning Strategy

This project uses **date-based versioning** in the format `YYYY-MM-DD`.

### Version Update Requirements

**ALWAYS update versions when:**

- Adding new features
- Making any code changes
- Deploying updates

**Files to update:**

1. `public/manifest.json` - Update the `version` field
2. `package.json` - Update the `version` field
3. Regenerate `package-lock.json` by running `npm install`

### Version Update Rules

- **New day = New version**: Use the current date (YYYY-MM-DD) for any changes
- **Same day = No update needed**: Multiple changes on the same day don't require version updates
- **Consistency**: Both manifest.json and package.json must have matching versions

### Example Workflow

```bash
# 1. Update version in both files to current date
# 2. Regenerate package-lock.json
npm install
# 3. Build and test
npm run build
# 4. Commit changes
```

This ensures proper version tracking for the Owlbear Rodeo extension and maintains consistency across all configuration files.

## Code Quality and Formatting

### Formatting and Linting Requirements

**ALWAYS format and lint files after editing them:**

- **TypeScript/JavaScript files**: Automatically formatted by the IDE and TypeScript compiler
- **Build verification**: Run `npm run build` to ensure no TypeScript errors
- **File consistency**: Ensure proper formatting and no linting violations

### Post-Edit Workflow

After making any file changes:

```bash
# 1. Verify build passes (includes TypeScript checking)
npm run build

# 2. Check for any linting issues in IDE
# 3. Ensure files are properly formatted
```

### Quality Standards

- **No TypeScript errors**: All code must pass `tsc` compilation
- **Consistent formatting**: Follow existing code style patterns
- **Clean imports**: Remove unused imports and maintain proper organization
- **Proper indentation**: Maintain consistent spacing and formatting
