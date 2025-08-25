
# Map Location Keys

![Map Location Keys](public/img/hero.png)

## Description

Map Location Keys is an extension for [Owlbear Rodeo](https://owlbear.rodeo) that allows you to add location keys to a map by using TEXT items.

<!-- markdownlint-disable MD033 -->
<a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
  <img
    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
    alt="Buy Me A Coffee"
    height="60px" width="217px"
  />
</a>
<!-- markdownlint-enable MD033 -->

## Installation

Use the following URL to add this extension to [Owlbear Rodeo](https://owlbear.rodeo):

```text
https://map-location-keys.vercel.app/manifest.json
```

## Features Roadmap

- [x] Add location keys to `TEXT` items
- [x] Markdown support
- [x] Export location keys to a `YAML` file
- [x] Import location keys from a `YAML` file
- [x] Re-center the scene on an item from its Location Key

## Usage

### Add a Location Key

Select a TEXT item and choose "Add Location Key" from the context menu.

![Add location key](public/img/add-location-key.png)

### Remove a Location Key

Select a TEXT item and choose "Remove Location Key" from the context menu.

![Remove location key](public/img/remove-location-key.png)

### Edit a Location Key

You can edit location keys using Markdown.

![Edit a location key](public/img/edit.png)

### Player Visibility Feature

GMs can now share location information with players by making specific location keys visible to them.

#### How it works:

1. **Edit a location key** - Add information specifically for players in the "Player Information" field
2. **Toggle visibility** - Use the checkbox in the edit form or the eye icon button in the GM view  
3. **Player access** - Players will see location keys marked as visible with only the player information content

#### GM Controls:

- **Context Menu**: Right-click any location key and select "Toggle Player Visibility"
- **Edit Form**: Check/uncheck "Make visible to players" when editing a location key
- **GM View**: Click the eye icon button to quickly toggle visibility
- **Visual Indicators**: Eye icon shows next to location key names that are visible to players

#### Player Experience:

- Players see a "Location Information" section instead of the full GM interface
- Only location keys marked as player-visible are shown
- Players see the custom "Player Information" content (supports Markdown)
- Players can use "Show on Map" to navigate to visible locations

### Release Notes

#### 2024-08-25

- Added player visibility feature - GMs can now share location information with players
- New "Player Information" field for custom player-facing content
- Toggle player visibility via context menu, edit form, or GM view buttons
- Player interface shows only visible location keys with custom information

#### 2024-07-17

- Expanding the location after editing

#### 2024-07-12

- Support for `PROP` layer (documentation pending)
