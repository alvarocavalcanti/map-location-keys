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
- **Context Menu System**: Adds right-click options to TEXT/PROP items for adding/removing location keys
- **Metadata Storage**: Location keys are stored in item metadata using the pattern `${ID}/metadata`

### Key Components

- `src/components/App.tsx` - Main app component that checks if Owlbear scene is ready
- `src/contextMenu.ts` - Defines context menu actions for adding/removing/revealing location keys
- `src/components/SPA.tsx` - Main single-page application routing
- `src/components/LocationKeys.tsx` - Main interface for managing location keys
- `src/@types/types.d.ts` - TypeScript definitions for LocationKey interface

### Extension Architecture

- **Manifest**: `public/manifest.json` defines the extension metadata and popover dimensions (400x600)
- **Context Menus**: Three context menu items for GM-only actions:
  - Add Location Key (for items without metadata)
  - Remove Location Key (for items with metadata) 
  - Reveal Location Key (opens popover and broadcasts item ID)
- **Broadcasting**: Uses OBR broadcast system to communicate between context menu and popover
- **Analytics**: Integrated with Vercel Analytics and Google Analytics for usage tracking

### Data Flow

1. GM right-clicks TEXT/PROP items to add location keys via context menu
2. Location keys stored as metadata on Owlbear items using template in `contextMenu.ts:6-14`
3. Popover interface allows editing, importing/exporting YAML, and navigation
4. Broadcasting enables revealing specific location keys from context menu

### Dependencies

- **UI**: React + React Bootstrap for interface components
- **Routing**: React Router DOM for SPA navigation
- **Markdown**: Remarkable for rendering location key descriptions
- **File Operations**: file-saver and js-yaml for import/export functionality
- **Icons**: FontAwesome for UI icons

## Build System

- **Vite** with React plugin for development and building
- **TypeScript** with strict mode and additional linting rules
- No testing framework currently configured