import React, { useEffect, useState } from "react";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import MarkdownRenderer from "./util/MarkdownRenderer";
import { LocationKey } from "../@types/types";
import {
  getItemText,
  loadExistingLocationKeys,
  sortLocationKeys,
  analytics
} from "../utils";
import { track } from "@vercel/analytics";
import { ID } from "../main";

const PlayerView: React.FC = () => {
  const [playerVisibleKeys, setPlayerVisibleKeys] = useState<LocationKey[]>([]);
  const [locationToReveal, setLocationToReveal] = useState<string>("");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editedPlayerInfo, setEditedPlayerInfo] = useState<string>("");

  const handleToggleClick = (id: string) => {
    setLocationToReveal((prevKey) => (prevKey === id ? "" : id));
  };

  const handleEdit = (locationKey: LocationKey) => {
    setEditingLocationId(locationKey.id);
    setEditedPlayerInfo(locationKey.playerInfo || "");
  };

  const handleSave = (locationKey: LocationKey) => {
    track("player_edit_location_info");
    analytics.track("player_edit_location_info");
    OBR.scene.items.updateItems(
      (item) => item.id === locationKey.id,
      (items) => {
        for (let item of items) {
          const metadata = item.metadata[`${ID}/metadata`] as any;
          if (metadata) {
            metadata.playerInfo = editedPlayerInfo;
            item.metadata[`${ID}/metadata`] = metadata;
          }
        }
      }
    ).then(() => {
      setEditingLocationId(null);
      setEditedPlayerInfo("");
    });
  };

  const handleCancel = () => {
    setEditingLocationId(null);
    setEditedPlayerInfo("");
  };

  const showOnMap = (id: string) => {
    track("player_show_location_on_map");
    analytics.track("player_show_location_on_map");
    OBR.scene.items.getItemBounds([id]).then((bounds) => {
      OBR.viewport.animateToBounds({
        ...bounds,
        min: { x: bounds.min.x - 1000, y: bounds.min.y - 1000 },
        max: { x: bounds.max.x + 1000, y: bounds.max.y + 1000 },
      });
    });
  };

  const loadPlayerVisibleKeys = (items: Item[]): void => {
    const allLocationKeys: LocationKey[] = [];
    loadExistingLocationKeys(items, allLocationKeys, getItemText);

    const visibleKeys = allLocationKeys.filter(key => key.isPlayerVisible);
    sortLocationKeys(visibleKeys);

    setPlayerVisibleKeys(visibleKeys);
  };

  useEffect(() => {
    OBR.scene.items.onChange(loadPlayerVisibleKeys);
    OBR.scene.isReady().then(() => {
      OBR.scene.items.getItems().then(loadPlayerVisibleKeys);
    });

    OBR.broadcast.onMessage(`${ID}/broadcast`, (event) => {
      setLocationToReveal(event.data as string);
      window.document
        .getElementById(`player-accordion-${event.data as string}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  analytics.page();

  return (
    <div className="p-4">
      {playerVisibleKeys.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-3">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Location Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your GM has shared these location details with you.
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {playerVisibleKeys.map((locationKey, index) => (
              <div
                key={String(index)}
                id={`player-accordion-${locationKey.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
              >
                <button
                  onClick={() => handleToggleClick(locationKey.id)}
                  className="w-full px-4 py-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
                >
                  <span>{locationKey.name}</span>
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
                    {editingLocationId === locationKey.id ? (
                      <>
                        <textarea
                          rows={6}
                          value={editedPlayerInfo}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedPlayerInfo(e.target.value)}
                          className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your notes about this location..."
                        />
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <button
                            onClick={() => handleSave(locationKey)}
                            className="px-4 py-2 bg-blue-600 border-2 border-blue-600 text-white rounded hover:bg-blue-700 hover:border-blue-700 font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-600 border-2 border-red-600 text-white rounded hover:bg-red-700 hover:border-red-700 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => showOnMap(locationKey.id)}
                            className="px-4 py-2 bg-gray-500 border-2 border-gray-500 text-white rounded hover:bg-gray-600 hover:border-gray-600 font-medium transition-colors"
                          >
                            Show
                          </button>
                          <div></div>
                        </div>
                      </>
                    ) : (
                      <>
                        {locationKey.playerInfo ? (
                          <div className="markdown-content mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <MarkdownRenderer>{locationKey.playerInfo}</MarkdownRenderer>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic mb-3">No additional information provided.</p>
                        )}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <button
                            onClick={() => showOnMap(locationKey.id)}
                            className="px-4 py-2 bg-gray-500 border-2 border-gray-500 text-white rounded hover:bg-gray-600 hover:border-gray-600 font-medium transition-colors"
                          >
                            Show
                          </button>
                          <button
                            onClick={() => handleEdit(locationKey)}
                            className="px-4 py-2 bg-blue-600 border-2 border-blue-600 text-white rounded hover:bg-blue-700 hover:border-blue-700 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <div></div>
                          <div></div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Location Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your GM hasn't shared any location information with players yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerView;
