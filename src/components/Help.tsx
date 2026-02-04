import React from "react";
import { analytics } from "../utils";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import ThemeSelector from "./ThemeSelector";
import { ThemeId } from "../themes";

const Help: React.FC<{ version: string; currentTheme: ThemeId; onThemeChange: (theme: ThemeId) => void }> = ({ version, currentTheme, onThemeChange }) => {
  const [activeSection, setActiveSection] = React.useState<string>("");

  const itemsAdd: { header: string; image: string; description?: string }[] = [
    {
      header: "1. Add or select an existing TEXT item",
      image: "img/help01.png",
      description:
        "Use one or two characters for optimal display, e.g. 'A1', 'B2', '7', '8a'.",
    },
    {
      header: '2. Click the "Add Location Key" button',
      image: "img/help02.png",
    },
    { header: "3. Edit Location Key's description", image: "img/help03.png" },
    { header: "4. Save your changes", image: "img/help04.png" },
  ];
  const itemsExport: { header: string; text: string }[] = [
    {
      header: "1. Click the Export button",
      text: "A YAML file will be downloaded to your computer.",
    },
  ];

  const itemsImport = [
    {
      id: "import-0",
      header: "1. Paste a valid YAML content",
      content: (
        <div className="text-gray-700 dark:text-gray-300">
          Valid YAML content should be in the following format:
          <br className="mb-3" />
          <ul className="list-disc list-inside my-2">
            <li>
              <strong>description</strong> is a multiline string that can
              contain markdown.
            </li>
            <li>
              <strong>name</strong> is a string that represents the Location
              Key. This will be the text of the TEXT item, please use one or
              two characters for optimal display, e.g. 'A1', 'B2', '7', '8a'
            </li>
            <li>
              <strong>id</strong> is a string that represents the ID of the
              TEXT item. This is optional and can be left blank.
            </li>
            <li>
              <strong>playerInfo</strong> is an optional string that contains
              information visible to players when the location key is shared with them.
              Supports Markdown.
            </li>
            <li>
              <strong>isPlayerVisible</strong> is an optional boolean that
              determines if the location key is visible to players. Defaults to false.
            </li>
          </ul>
          Example:
          <br className="mb-3" />
          <pre className="bg-gray-700 text-gray-100 p-3 rounded overflow-x-auto">
{`- description: |-
    # Evocative Name

    **Description:**

    **Features:**

    **Creatures:**

    **Notes:**
  name: '1'
  id: ''
  playerInfo: 'A mysterious room with ancient symbols on the walls.'
  isPlayerVisible: true
- description: |-
    # Other Evocative Name

    **Description:**

    **Features:**

    **Creatures:**

    **Notes:**
  name: '2'
  id: ''
  playerInfo: ''
  isPlayerVisible: false`}
          </pre>
        </div>
      )
    },
    {
      id: "import-1",
      header: "2. Click Import",
      content: (
        <div className="text-gray-700 dark:text-gray-300">
          If the content is valid, the Location Keys will be imported and
          added to the scene from the top left corner.
          <br />
          <img
            src="img/help05.png"
            alt="New Location Key items"
            className="w-full rounded border border-gray-300 dark:border-gray-600 my-2"
          />
          You can move them around as needed.
        </div>
      )
    }
  ];

  const itemsPlayerSharing = [
    {
      id: "player-0",
      header: "1. Add Player Information",
      content: (
        <div className="text-gray-700 dark:text-gray-300">
          When editing a location key, you can add information specifically for players in the "Player Information" field. This content supports Markdown and will be shown to players when the location key is made visible to them.
          <br /><br />
          This field is separate from your GM notes, so you can include player-appropriate descriptions while keeping your GM-only information private.
        </div>
      )
    },
    {
      id: "player-1",
      header: "2. Make Location Key Visible to Players",
      content: (
        <div className="text-gray-700 dark:text-gray-300">
          You can make location keys visible to players in several ways:
          <ul className="list-disc list-inside my-2">
            <li><strong>Edit Form:</strong> Check the "Make visible to players" checkbox when editing a location key</li>
            <li><strong>Context Menu:</strong> Right-click any location key and select "Toggle Player Visibility"</li>
            <li><strong>GM View:</strong> Click the eye icon button next to any location key to quickly toggle visibility</li>
          </ul>
          Location keys that are visible to players will show an eye icon (👁️) next to their name in the GM view.
        </div>
      )
    },
    {
      id: "player-2",
      header: "3. Player Experience",
      content: (
        <div className="text-gray-700 dark:text-gray-300">
          When players open the extension, they will see:
          <ul className="list-disc list-inside my-2">
            <li>A "Location Information" section instead of the full GM interface</li>
            <li>Only location keys that you've marked as player-visible</li>
            <li>The custom "Player Information" content you've written for each location</li>
            <li>A "Show" button to navigate to each visible location</li>
          </ul>
          If no location keys are made visible to players, they'll see a message saying "Your GM hasn't shared any location information with players yet."
        </div>
      )
    }
  ];

  analytics.page();

  const opts = {
    width: "300",
  };

  const toggleSection = (id: string) => {
    setActiveSection(prev => prev === id ? "" : id);
  };

  return (
    <>
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Video Tutorial</h2>
        <YouTube videoId="jJM_600M1eo" opts={opts} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Adding Location Keys</h2>
      </div>
      <div className="mb-3 space-y-2">
        {itemsAdd.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => toggleSection(`add-${index}`)}
              className="w-full px-4 py-2 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
            >
              <span>{item.header}</span>
              <svg
                className={`w-5 h-5 transition-transform ${activeSection === `add-${index}` ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === `add-${index}` && (
              <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                {item.description && <p className="text-gray-700 dark:text-gray-300 mb-2">{item.description}</p>}
                <img src={item.image} alt={item.header} className="w-full rounded border border-gray-300 dark:border-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exporting Location Keys</h2>
      </div>
      <div className="mb-3 space-y-2">
        {itemsExport.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => toggleSection(`export-${index}`)}
              className="w-full px-4 py-2 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
            >
              <span>{item.header}</span>
              <svg
                className={`w-5 h-5 transition-transform ${activeSection === `export-${index}` ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === `export-${index}` && (
              <div className="p-4 border-t border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {item.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Importing Location Keys</h2>
      </div>
      <div className="mb-3 space-y-2">
        {itemsImport.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => toggleSection(item.id)}
              className="w-full px-4 py-2 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
            >
              <span>{item.header}</span>
              <svg
                className={`w-5 h-5 transition-transform ${activeSection === item.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === item.id && (
              <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sharing Location Keys with Players</h2>
      </div>
      <div className="mb-3 space-y-2">
        {itemsPlayerSharing.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => toggleSection(item.id)}
              className="w-full px-4 py-2 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
            >
              <span>{item.header}</span>
              <svg
                className={`w-5 h-5 transition-transform ${activeSection === item.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === item.id && (
              <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <a
          href="https://shadowcrawler.vercel.app"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faGlobeAfrica} /> shadowcrawler.vercel.app
        </a>
      </div>
      <div className="mt-2 text-center">
        <a
          href="https://github.com/alvarocavalcanti/shadowcrawler"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faGithub} /> alvarocavalcanti/shadowcrawler
        </a>
      </div>
      <div className="mt-2 text-center">
        <a
          href="https://bsky.app/profile/alvarocavalcanti.bsky.social"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faBluesky} /> alvarocavalcanti.bsky.social
        </a>
      </div>
      <div className="mt-2 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faTwitter} /> alvarocavalcant
        </a>
      </div>
      <div className="p-2 text-center">
        <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="h-[60px] w-[217px] inline-block"
          />
        </a>
      </div>
      <div className="p-2 text-center">
        <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
          <img
            height="36"
            className="h-9 inline-block"
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
      <div className="text-center">
        <em className="text-gray-500 dark:text-gray-400 text-sm">
          Version: {version} |
          <a
            href="https://github.com/alvarocavalcanti/map-location-keys/blob/main/RELEASE-NOTES.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:underline ml-1"
          >
            Release Notes
          </a>
        </em>
      </div>
    </>
  );
};

export default Help;
