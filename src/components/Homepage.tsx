import React, { useEffect, useState } from "react";

import Help from "./Help";
import PlayerView from "./PlayerView";
import { analytics } from "../utils";

const Homepage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isHomepage = urlParams.has("homepage");

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);
  
  useEffect(() => {
    if (!isHomepage) {
      window.location.href = "/?homepage";
    }
  }, []);

  analytics.page();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <img
          src="https://map-location-keys.vercel.app/img/hero.png"
          alt="Map Location Keys"
          className="mb-4 w-full"
        />
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Map Location Keys</h1>
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          <em>
            An{" "}
            <a href="https://owlbear.rodeo" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
              Owlbear Rodeo
            </a>{" "}
            extension for adding location descriptions to a map.
            <br />
            By{" "}
            <a href="http://memorablenaton.es" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
              Alvaro Cavalcanti
            </a>
            <br />
            <a
              href="https://twitter.com/alvarocavalcant"
              target="_blank"
              className="m-1 inline-block"
            >
              <img
                src="https://img.shields.io/twitter/follow/alvarocavalcant?style=social"
                alt="Follow @alvarocavalcant on Twitter"
              />
            </a>
            <a
              href="https://github.com/alvarocavalcanti"
              target="_blank"
              className="m-1 inline-block"
            >
              <img
                src="https://img.shields.io/badge/GitHub-alvarocavalcanti-blue?style=flat-square&logo=github"
                alt="GitHub Profile"
              />
            </a>
          </em>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Overview</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          With this extension you can add "location keys" to a map, which
          usually contain descriptions of a particular room or feature.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Location Keys can be kept private to the GM or shared with players
          using the new player visibility feature.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You only need to add a text item to the map, ideally one or two
          characters long, eg: 1, 5a, B2, etc.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Then using the context menu you can add it to the Location Keys.
          Now, using the drawer menu you can see a default description has
          been added for that item, but you can edit it as you like.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          The description supports Markdown and there are Import/Export
          features for handling several locations at a time. You can also
          add player-specific information and control which location keys
          are visible to players.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          The idea here is to reduce tab switching between OBR and wherever
          your map descriptions are. With a little prep you can add the
          descriptions to OBR, ideally in a summarised form, and have a
          smoother experience.
        </p>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Installation</h2>
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          You can follow the instructions on{" "}
          <a href="https://extensions.owlbear.rodeo/guide" className="text-blue-600 dark:text-blue-400 hover:underline">Owlbear Rodeo</a>{" "}
          to install the extension, and use the following URL:
          <br />
          <br />
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded"><code>https://map-location-keys.vercel.app/manifest.json</code></pre>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Features in Action</h2>
        <br />
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Adding a Location Key</h3>
        <video
          src="https://map-location-keys.vercel.app/video/01-add-location-key.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Removing a Location Key</h3>
        <video
          src="https://map-location-keys.vercel.app/video/02-remove-location-key.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Editing a Location Key</h3>
        <video
          src="https://map-location-keys.vercel.app/video/03-edit-location-key.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Import Location Keys</h3>
        <p className="mb-2 text-gray-700 dark:text-gray-300">See Help section below for the format.</p>
        <video
          src="https://map-location-keys.vercel.app/video/04-import-location-keys.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Showing a Location Key on the Map</h3>
        <video
          src="https://map-location-keys.vercel.app/video/05-show-location-key.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Exporting Location Keys</h3>
        <video
          src="https://map-location-keys.vercel.app/video/06-export-location-keys.mp4"
          className="w-full rounded border border-gray-300 dark:border-gray-600 mb-4"
          controls
        ></video>
        <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white">Player Visibility Features</h3>
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          <strong>New Feature:</strong> GMs can now share location information with players by:
          <ul className="list-disc list-inside my-2">
            <li>Adding custom "Player Information" content when editing location keys</li>
            <li>Toggling player visibility via context menu, edit form, or GM view buttons</li>
            <li>Players see a dedicated interface with only shared location information</li>
          </ul>
          <em>Video demonstration coming soon!</em>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Player View</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Players can now see location information that GMs choose to share!
          When GMs mark location keys as player-visible and add player-specific
          information, players will see a clean interface showing only the
          shared content. The Location Keys <strong>on the map</strong> remain
          visible to everyone unless you <strong>hide</strong> them.
        </p>
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          <strong>GM Controls:</strong>
          <ul className="list-disc list-inside my-2">
            <li>Add custom "Player Information" when editing location keys</li>
            <li>Toggle visibility using the context menu, edit form, or eye icon buttons</li>
            <li>Visual indicators show which keys are shared with players</li>
          </ul>
          <strong>Player Experience:</strong>
          <ul className="list-disc list-inside my-2">
            <li>See only location keys marked as player-visible</li>
            <li>View custom player-friendly descriptions (supports Markdown)</li>
            <li>Navigate to locations using "Show" buttons</li>
          </ul>
        </div>
        <PlayerView />
        <br />
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Feedback</h2>
        <p className="mb-2 text-gray-700 dark:text-gray-300">There are a few ways to provide feedback:</p>
        <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
          <li>
            <a
              href="https://discord.com/channels/795808973743194152/1242847926108028988"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Owlbear Rodeo Discord Thread
            </a>
          </li>
          <li>
            <a href="https://twitter.com/alvarocavalcant" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
              Twitter/X
            </a>
          </li>
          <li>
            <a href="https://github.com/alvarocavalcanti" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
              Github
            </a>
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Help Topics</h2>
        <Help version={version} />
      </div>
    </div>
  );
};

export default Homepage;
