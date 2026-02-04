export interface ReleaseHighlight {
  version: string;
  date: string;
  highlights: string[];
}

export const releaseHighlights: ReleaseHighlight[] = [
  {
    version: "2026-02-04",
    date: "February 4, 2026",
    highlights: [
      "🎨 New customizable color themes - Choose from 4 beautiful palettes",
      "⚡ 94% smaller CSS bundle for faster loading",
      "🚀 48% fewer modules for improved performance",
      "🎯 Enhanced button visibility and interaction design",
      "🌙 Better dark mode support with improved contrast"
    ]
  },
  {
    version: "2024-08-25",
    date: "August 25, 2024",
    highlights: [
      "👥 Player visibility feature - Share location info with players",
      "📝 Custom player information field with Markdown support",
      "👁️ Toggle visibility via context menu, edit form, or buttons",
      "🎮 Dedicated player interface for shared locations"
    ]
  }
];

export const changelogUrl = "https://github.com/alvarocavalcanti/map-location-keys/blob/main/RELEASE-NOTES.md";
