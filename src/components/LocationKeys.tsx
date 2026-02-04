import { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import { track } from "@vercel/analytics";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MarkdownRenderer from "./util/MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { ID } from "../main";
import { paths } from "./util/constants";
import { analytics } from "../utils";

const LocationKeys: React.FC<{
  setLocationKeyToEdit: (locationKey: LocationKey) => void;
  locationKeys: LocationKey[];
}> = ({ setLocationKeyToEdit: setLocationKeyToEdit, locationKeys }) => {
  const [locationToReveal, setLocationToReveal] = React.useState<string>("");

  const handleToggleClick = (id: string) => {
    setLocationToReveal((prevKey) => (prevKey === id ? "" : id));
  };

  const showOnMap = (id: string) => {
    track("show_location_key_on_map");
    analytics.track("show_location_key_on_map");
    OBR.scene.items.getItemBounds([id]).then((bounds) => {
      OBR.viewport.animateToBounds({
        ...bounds,
        min: { x: bounds.min.x - 1000, y: bounds.min.y - 1000 },
        max: { x: bounds.max.x + 1000, y: bounds.max.y + 1000 },
      });
    });
  };

  const togglePlayerVisibility = (id: string) => {
    track("toggle_player_visibility");
    analytics.track("toggle_player_visibility");
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[`${ID}/metadata`] as any;
        if (metadata) {
          metadata.isPlayerVisible = !metadata.isPlayerVisible;
          item.metadata[`${ID}/metadata`] = metadata;
        }
      }
    });
  };

  useEffect(() => {
    OBR.broadcast.onMessage(`${ID}/broadcast`, (event) => {
      setLocationToReveal(event.data as string);
      window.document
        .getElementById(`accordion-${event.data as string}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  analytics.page();

  return (
    <>
      {locationKeys.length > 0 ? (
        <>
          <div className="space-y-2">
            {locationKeys.map((locationKey, index) => (
              <div
                key={String(index)}
                id={`accordion-${locationKey.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
              >
                <button
                  onClick={() => handleToggleClick(locationKey.id)}
                  className="w-full px-4 py-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    {locationKey.name}
                    {locationKey.isPlayerVisible && (
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-green-600 dark:text-green-400"
                        title="Visible to players"
                      />
                    )}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${locationToReveal === locationKey.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {locationToReveal === locationKey.id && (
                  <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="markdown-content mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      <MarkdownRenderer>{locationKey.description || ""}</MarkdownRenderer>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center mt-1">
                      <Link to={`/location-key/${locationKey.name}?item-id=${locationKey.id}`}>
                        <button
                          onClick={() =>
                            setLocationKeyToEdit({
                              id: locationKey.id,
                              name: locationKey.name,
                              description: locationKey.description,
                              playerInfo: locationKey.playerInfo,
                              isPlayerVisible: locationKey.isPlayerVisible,
                            })
                          }
                          className="w-full px-4 py-2 bg-theme-primary border-2 border-theme-primary text-white rounded font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => showOnMap(locationKey.id)}
                        className="px-4 py-2 bg-theme-secondary border-2 border-theme-secondary text-white rounded font-medium transition-colors"
                      >
                        Show
                      </button>
                      <button
                        onClick={() => togglePlayerVisibility(locationKey.id)}
                        className={`px-4 py-2 rounded border-2 font-medium transition-colors ${
                          locationKey.isPlayerVisible
                            ? "bg-theme-success border-theme-success text-white"
                            : "bg-white dark:bg-gray-800 border-theme text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        title={
                          locationKey.isPlayerVisible
                            ? "Hide from players"
                            : "Show to players"
                        }
                      >
                        <FontAwesomeIcon
                          icon={locationKey.isPlayerVisible ? faEye : faEyeSlash}
                        />
                      </button>
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Location Keys</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-0">
            The location keys will show up here once you add them. Click{" "}
            <Link to={paths.help} className="text-blue-600 dark:text-blue-400 hover:underline">here</Link> to learn how to do so.
          </p>
        </div>
      )}
      <div className="p-2 text-center">
        <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="h-[60px] w-[217px] inline-block"
          />
        </a>
      </div>
    </>
  );
};

export default LocationKeys;
