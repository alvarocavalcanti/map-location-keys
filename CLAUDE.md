# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build locally

## Project Architecture

This is an Owlbear Rodeo extension that allows GMs to add location keys to TEXT and PROP items on maps. The extension provides a popover interface for managing these location keys.

The extension operates in two modes:

1. **OBR Plugin Mode**: Integrated with Owlbear Rodeo as a popover extension
2. **Standalone Mode**: Marketing homepage accessible outside OBR

### Initialization & Lifecycle

The application follows a multi-stage initialization process:

1. **Entry Point** (`main.tsx`):
   - Detects environment via URL parameter `?obrref`
   - If `obrref` is present → renders `PluginGate` (OBR plugin mode)
   - If `obrref` is absent → renders `Homepage` (standalone marketing page)
   - Extension ID: `es.memorablenaton.map-location-keys`

2. **Plugin Gate** (`PluginGate.tsx`):
   - Waits for `OBR.isAvailable` to be true
   - Calls `OBR.onReady()` to initialize SDK
   - Shows `OBRLoading` component until ready
   - Guards all OBR SDK interactions

3. **Scene Readiness** (`App.tsx`):
   - Checks `OBR.scene.isReady()` on mount
   - Subscribes to `OBR.scene.onReadyChange()` for state updates
   - Shows `SceneNotReady` if no active scene
   - Initializes `BrowserRouter` when scene is ready

4. **SPA Initialization** (`SPA.tsx`):
   - Sets up three context menus via `setupContextMenu()`
   - Loads initial location keys from scene items
   - Subscribes to:
     - `OBR.scene.items.onChange()` - reload location keys on item changes
     - `OBR.theme.onChange()` - sync dark/light mode
     - `OBR.player.onChange()` - update role (GM vs Player)
   - Subscribes to broadcast channel for reveal messages
   - Conditionally renders GM or Player routes based on role

### State Management Patterns

This application uses **local React state** without global state management libraries.

**Top-Level State** (`SPA.tsx`):

- `locationKeys: LocationKey[]` - Master list of all location keys
- `locationKeyToEdit: LocationKeyType` - Currently selected item for editing
- `role: "GM" | "PLAYER"` - Current player role
- `version: string` - Extension version from manifest.json

**State Sources**:

- **OBR SDK as Source of Truth**: All data stored in Owlbear item metadata
- **Subscription-Based Updates**: OBR SDK callbacks trigger state updates
- **No Global Context**: Each component manages its own local state
- **Props for Communication**: Parent passes state and handlers to children

**Update Pattern**:

1. User action triggers OBR SDK method (`updateItems`, `deleteItems`, `addItems`)
2. OBR propagates change to all clients
3. `onChange` listener fires in all connected instances
4. State reloaded via `loadExistingLocationKeys()`
5. React re-renders affected components

### Core Structure

- **Owlbear Rodeo SDK Integration**: Uses `@owlbear-rodeo/sdk` for all map interactions
- **React SPA**: Single-page application with React Router for navigation
- **Tab-Based Navigation**: Bootstrap Tab.Container with horizontal tabs (Location Keys, Tools, Help)
- **Context Menu System**: Adds right-click options to TEXT and PROP layer items
- **Metadata Storage**: Location keys stored in item metadata using pattern `${ID}/metadata`
- **Role-Based Routing**: Separate route trees for GM and Player roles
- **Theme Synchronization**: Matches OBR dark/light mode via `data-bs-theme` attribute
- **Broadcasting**: Local broadcast channel for context menu ↔ popover communication
- **Compact Spacing**: Optimized padding and margins throughout (`p-2`, `py-2`, `mb-3`) for maximum content visibility

### Component Hierarchy

```
main.tsx (Entry Point)
├── Homepage (if no ?obrref parameter)
│   └── Standalone marketing page
│
└── PluginGate (if ?obrref parameter present)
    └── OBRLoading (until OBR.onReady)
        └── App
            ├── SceneNotReady (if !scene.isReady)
            └── SPA (if scene.isReady)
                ├── GM Interface (if role === "GM")
                │   ├── Tab Navigation (Bootstrap Tab.Container)
                │   │   ├── "Location Keys" Tab
                │   │   │   ├── "/" → LocationKeys (main list)
                │   │   │   └── "/location-key/:id" → LocationKey (edit form)
                │   │   ├── "Tools" Tab
                │   │   │   ├── "/import-export" → ImportExport (YAML operations)
                │   │   │   ├── "/fog-export-import" → FogExportImport (Fog operations)
                │   │   │   └── "/bulk-actions" → AddDeleteAll (bulk operations)
                │   │   └── "Help" Tab
                │   │       └── "/help" → Help (documentation)
                │   └── Version display (right-aligned in tab navigation)
                │
                └── Player Routes (if role === "PLAYER")
                    ├── "/" → redirects to "/player-view"
                    └── "/player-view" → PlayerView (player interface)
```

### Key Components

**Guard Components**:

- `src/main.tsx` - Entry point, detects OBR vs standalone mode via URL params
- `src/components/PluginGate.tsx` - Waits for OBR SDK availability
- `src/components/OBRLoading.tsx` - Loading state while OBR initializes
- `src/components/App.tsx` - Checks if Owlbear scene is ready
- `src/components/SceneNotReady.tsx` - Warning when no active scene

**Core Application**:

- `src/components/SPA.tsx` - Main routing, tab navigation, context menu setup, OBR subscriptions

**GM Views**:

- `src/components/LocationKeys.tsx` - Main list view with visibility controls, edit/show buttons
- `src/components/LocationKey.tsx` - Edit form for description, playerInfo, visibility
- `src/components/ImportExport.tsx` - YAML import/export with validation and progress tracking
- `src/components/AddDeleteAll.tsx` - Bulk operations for adding/removing metadata
- `src/components/Help.tsx` - Documentation with tutorial videos

**Player Views**:

- `src/components/PlayerView.tsx` - Player interface showing only visible location keys

**Standalone**:

- `src/components/Homepage.tsx` - Marketing page for non-OBR access

**Utilities & Types**:

- `src/contextMenu.ts` - Three context menu definitions with metadata template
- `src/utils.ts` - Shared functions (loadExistingLocationKeys, sortLocationKeys, getItemText)
- `src/@types/types.d.ts` - LocationKey interface definition
- `src/components/util/constants.ts` - Route path constants

### Navigation Architecture

**Tab-Based Navigation (GM Interface)**:

The extension uses Bootstrap Tab components for navigation, replacing the previous dropdown navbar:

- **Three Main Tabs**:
  - **Location Keys**: Main list view and edit form routes
  - **Tools**: Consolidated tab containing Import/Export, Fog Export/Import, and Bulk Actions
  - **Help**: Documentation and tutorial content
- **Tab State Management**:
  - Active tab tracked in `SPA.tsx` state: `activeTab: string`
  - Tab selection triggers navigation via `useNavigate()` hook
  - Route changes automatically update active tab via `useLocation()` hook
- **Version Display**: Extension version shown in top-right of tab navigation
- **Benefits**:
  - Always-visible navigation (no dropdown required)
  - Single-click access to all sections
  - Reduced vertical space usage (~60-80px saved)
  - Cleaner, more modern interface

**Routing Integration**:

- Each tab contains its own `<Routes>` component with nested routes
- Navigation persists across route changes within the same tab
- Edit form (`/location-key/:id`) stays within Location Keys tab
- All tool-related routes consolidated under Tools tab

### Role-Based Architecture

The extension provides completely separate interfaces for GMs and Players:

**GM Interface** (Full Access):

- View all location keys regardless of visibility status
- Edit location key descriptions (markdown)
- Edit player info (optional markdown for players)
- Toggle player visibility via:
  - Context menu (right-click on map item)
  - Edit form checkbox
  - Eye icon button in list view
- Import/Export location keys as YAML
- Bulk operations (Add All, Delete All)
- Navigate to location keys on map (Show button)
- Reveal specific keys via context menu
- Access to all navigation menu options

**Player Interface** (View Only):

- View only location keys where `isPlayerVisible === true`
- See playerInfo content (NOT description content)
- Navigate to location keys on map (Show button)
- Receive reveal broadcasts from GM
- No editing capabilities
- No navigation menu
- No visibility controls
- Fallback message when no keys are shared

**Visibility Controls**:

- Visual indicator: Eye icon (FontAwesome faEye) shows in GM view when visible to players
- Content separation: `description` field for GM notes, `playerInfo` field for player-facing content
- Toggle methods: context menu, edit form, list view button

**Navigation Differences**:

- GM: Tab-based navigation with 3 main sections
- Player: No navigation menu, single-page view
- Role detection: `OBR.player.getRole()` determines interface

**Route Separation**:

- GM routes: Tab-based navigation with nested routes in SPA.tsx
- Player routes: Single route (`/player-view`) with no navigation menu
- Dynamic updates: `OBR.player.onChange()` triggers re-routing if role changes

### Complete Data Model

**LocationKey Interface** (`src/@types/types.d.ts`):

```typescript
export interface LocationKey {
  description: string;      // GM notes (markdown), shown only to GMs
  name: string;             // Display name, extracted from item text
  id: string;               // Owlbear item ID
  playerInfo?: string;      // Player-facing content (markdown), shown to players
  isPlayerVisible?: boolean; // Visibility flag, defaults to false
}
```

**Owlbear Item Metadata Structure**:

```typescript
item.metadata[`${ID}/metadata`] = {
  locationKey: string,      // The description markdown (GM content)
  playerInfo?: string,      // Optional player-facing content
  isPlayerVisible?: boolean // Optional visibility flag (default: false)
}
```

**Item Filtering**:

- Only items on TEXT or PROP layers are considered
- Metadata presence: `item.metadata[${ID}/metadata]` indicates location key
- Player filtering: Additional filter `key.isPlayerVisible === true`

**Text Extraction** (`utils.ts:getItemText`):

- **Rich Text Format** (preferred):
  - `item.text.richText` is array of paragraph objects
  - Each paragraph has `children` array of text nodes
  - Extracts text from all children, joins with spaces
- **Plain Text Format** (fallback):
  - Uses `item.text.plainText` directly
- **Empty Fallback**: Returns empty string if neither format available

**Metadata Template** (`contextMenu.ts`):

```typescript
const locationKeyTemplate = `
# Location Name

**Description:**
[Add location description here]

**Features:**
- [Feature 1]
- [Feature 2]

**Creatures:**
[List any creatures or NPCs]

**Treasure:**
[Note any treasure or items of interest]

**Notes:**
[Additional notes for the GM]
`;
```

### Data Flow

**Read Flow**:

1. `OBR.scene.items.getItems()` fetches all items
2. Filter for `item.layer === "TEXT" || item.layer === "PROP"`
3. Filter for `item.metadata[${ID}/metadata]` existence
4. Extract metadata fields: `locationKey`, `playerInfo`, `isPlayerVisible`
5. Extract name via `getItemText()` (richText or plainText)
6. Build LocationKey objects with id from item
7. Sort alphabetically via `sortLocationKeys()`
8. Update state via `setLocationKeys()`

**Write Flow**:

1. User triggers action (edit, add, remove)
2. Call OBR SDK method:
   - `OBR.scene.items.updateItems(predicate, updater)` - modify existing
   - `OBR.scene.items.addItems(items)` - create new
   - `OBR.scene.items.deleteItems(ids)` - remove items
3. Update item metadata within updater function
4. OBR propagates changes to all clients
5. `onChange` listener fires in all instances
6. State reloaded and UI updates

**Broadcasting Flow** (Reveal Feature):

1. GM right-clicks item → "Reveal Location Key"
2. Context menu sends broadcast:

   ```typescript
   OBR.broadcast.sendMessage(
     `${ID}/broadcast`,
     { itemId: item.id },
     { destination: "LOCAL" }
   )
   ```

3. Popover opens via `OBR.action.open()`
4. LocationKeys or PlayerView receives broadcast message
5. Accordion expands to show item
6. Scrolls to item: `scrollIntoView({ behavior: "smooth", block: "center" })`

**Theme Synchronization**:

1. `OBR.theme.getTheme()` on mount
2. `OBR.theme.onChange(callback)` subscribes to changes
3. Sets `document.body.dataset.bsTheme = theme.mode`
4. Bootstrap automatically applies dark/light styles

### Context Menu System

The extension defines **three separate context menus** for GM-only actions:

**1. Add/Remove Location Key** (`${ID}/context-menu-add-remove`):

- **Filter**: GM only, TEXT or PROP layer
- **Icons**: Two icons in one menu (conditional rendering)
  - **Add icon** (faPlus): Shows when `metadata[${ID}/metadata]` is undefined
  - **Remove icon** (faTrash): Shows when metadata exists
- **Add action**:
  - Sets metadata with `locationKeyTemplate`
  - Initializes `playerInfo: ""` and `isPlayerVisible: false`
- **Remove action**:
  - Confirms with `window.confirm()`
  - Deletes metadata: `delete item.metadata[${ID}/metadata]`

**2. Reveal Location Key** (`${ID}/context-menu-expand`):

- **Filter**: GM only, TEXT or PROP layer, has metadata
- **Icon**: faExpand
- **Action**:
  - Opens extension popover: `OBR.action.open()`
  - Broadcasts item ID to popover
  - Popover scrolls to item and expands accordion
- **Analytics**: Tracked as "reveal_location_key"

**3. Toggle Player Visibility** (`${ID}/context-menu-player-visibility`):

- **Filter**: GM only, TEXT or PROP layer, has metadata
- **Icon**: faEye
- **Action**:
  - Toggles `isPlayerVisible` boolean in metadata
  - No confirmation required
- **Analytics**: Tracked as "toggle_player_visibility"

**Setup Timing**:

- Context menus created in `SPA.tsx` during initialization
- Registered via `OBR.contextMenu.create(config)`
- Available immediately after scene is ready

**Important**: The documentation previously stated "four context menu items" but there are actually **three separate menus**, with one menu showing two different icons conditionally.

### Performance & Scalability

**Import Chunking** (`ImportExport.tsx`):

- **Problem**: Large imports (50+ items) can exceed OBR's rate limits
- **Solution**: Chunked processing in batches
  - `CHUNK_SIZE = 10` items per batch
  - `chunkArray()` utility splits arrays
  - Sequential processing with 200ms delay between batches
  - Progress indicators for each batch
- **Benefits**:
  - Prevents "max update size exceeded" errors
  - Avoids rate limiting
  - Prevents UI freezing
  - Provides user feedback during long operations

**Staircase Positioning Algorithm** (`ImportExport.tsx:calculateStaircasePosition`):

- **Purpose**: Organize imported items visually to reduce clutter
- **Algorithm**:

  ```typescript
  const itemSpacing = { x: 150, y: 80 };
  const maxStaircaseColumns = 8;
  const staircaseLength = Math.max(
    Math.min(Math.ceil(Math.sqrt(totalItems)), maxStaircaseColumns),
    Math.min(4, totalItems)
  );
  const stairStep = index % staircaseLength;
  const staircaseNumber = Math.floor(index / staircaseLength);
  ```

- **Pattern**: Items arranged diagonally in groups of up to 8, then new staircase starts
- **Default Start**: `{ x: 100, y: 100 }`
- **Spacing**: 150px horizontal, 80px vertical between items
- **Scaling**: Adapts staircase length based on total item count

**Text Item Creation** (`ImportExport.tsx:buildText`):

- **Styling**: Fixed style applied to all imported items
  - Font size: 120
  - Font weight: 700 (bold)
  - Fill color: Red
  - Stroke: White, 20px width
- **Note**: TODO comment suggests making style configurable in future

**Item Filtering**:

- Filters applied at query time via OBR SDK
- No client-side filtering of large datasets
- Player view adds additional filter: `isPlayerVisible === true`

**Sorting**:

- In-place alphabetical sort via `Array.sort()`
- Case-insensitive via `toUpperCase()`
- O(n log n) complexity, single pass

### Analytics Integration

The extension tracks user interactions via two analytics systems:

**Vercel Analytics** (`utils.ts`):

- Import: `import { track } from "@vercel/analytics"`
- Usage: `track("event_name")`

**Google Analytics** (`utils.ts`):

- Custom implementation: `analytics.track("event_name")`
- Loaded via Google Tag Manager in `index.html`

**Tracked Events**:

- `add_location_key` - Context menu add action
- `remove_location_key` - Context menu remove action
- `reveal_location_key` - Context menu reveal action
- `toggle_player_visibility` - Context menu visibility toggle
- `export_location_keys` - Export button clicked
- `import_location_keys` - Import button clicked
- `show_location_key` - Show on map button clicked
- `save_location_key` - Edit form saved
- `add_all_location_keys` - Bulk add operation
- `delete_all_location_keys` - Bulk delete operation

**Implementation Pattern**:

```typescript
track("event_name");
analytics.track("event_name");
```

Both analytics calls are made together for redundancy.

### OBR SDK Integration Reference

Complete list of Owlbear Rodeo SDK methods used:

**Scene Management**:

- `OBR.scene.isReady()` - Check if scene is loaded
- `OBR.scene.onReadyChange(callback)` - Subscribe to scene readiness changes

**Item Operations**:

- `OBR.scene.items.getItems(filter?)` - Query items with optional filter
- `OBR.scene.items.onChange(callback)` - Subscribe to item changes
- `OBR.scene.items.updateItems(predicate, updater)` - Modify existing items
- `OBR.scene.items.deleteItems(ids)` - Remove items by ID
- `OBR.scene.items.addItems(items)` - Create new items
- `OBR.scene.items.getItemBounds(ids)` - Get position bounds for items

**Item Builder**:

- `buildText()` - Fluent API for creating text items with:
  - `richText(content)` - Set rich text content
  - `position(coords)` - Set x,y coordinates
  - `layer("TEXT")` - Set item layer
  - `metadata(data)` - Set custom metadata
  - `fillColor(color)` - Set text color
  - `fontSize(size)` - Set font size
  - `fontWeight(weight)` - Set font weight
  - `strokeColor(color)` - Set outline color
  - `strokeWidth(width)` - Set outline width
  - `build()` - Create item object

**Context Menu**:

- `OBR.contextMenu.create(config)` - Register context menu items

**Action**:

- `OBR.action.open()` - Open extension popover

**Broadcast**:

- `OBR.broadcast.sendMessage(channel, data, options)` - Send message
  - Channel: `${ID}/broadcast`
  - Destination: `"LOCAL"` (same client only)
- `OBR.broadcast.onMessage(channel, callback)` - Subscribe to messages

**Theme**:

- `OBR.theme.getTheme()` - Get current theme
- `OBR.theme.onChange(callback)` - Subscribe to theme changes
  - Returns: `{ mode: "DARK" | "LIGHT" }`

**Player**:

- `OBR.player.getRole()` - Get current player role
- `OBR.player.onChange(callback)` - Subscribe to role changes
  - Returns: `"GM" | "PLAYER"`

**Viewport**:

- `OBR.viewport.animateToBounds(bounds)` - Animate camera to position
  - Adds 1000px margin around item bounds for context

**Notification**:

- `OBR.notification.show(message, type)` - Show toast notification

**Core**:

- `OBR.isAvailable` - Boolean flag for SDK availability
- `OBR.onReady(callback)` - Initialize SDK connection

### Extension Architecture

- **Manifest**: `public/manifest.json` defines extension metadata and popover dimensions (600x600)
- **Extension ID**: `es.memorablenaton.map-location-keys`
- **Popover Mode**: Opens in Owlbear Rodeo drawer/popover
- **Standalone Access**: Marketing homepage accessible at root URL without `?obrref` parameter

### Dependencies

- **UI**: React + React Bootstrap for interface components
- **Routing**: React Router DOM for SPA navigation
- **Markdown**: Remarkable for rendering location key descriptions
- **File Operations**: file-saver and js-yaml for import/export functionality
- **Icons**: FontAwesome for UI icons
- **Analytics**: Vercel Analytics + Google Analytics for usage tracking
- **SDK**: @owlbear-rodeo/sdk for all OBR interactions

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
- always lint/format the files you generate
