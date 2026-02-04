import React from "react";
import { useNavigate } from "react-router-dom";

import type { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import { ID } from "../main";
import { track } from "@vercel/analytics";
import { analytics } from "../utils";

const LocationKey: React.FC<{
  locationKey: LocationKey;
  setSelectedLocationKey: (locationKey: LocationKey) => void;
}> = ({ locationKey }) => {
  const [description, setDescription] = React.useState(
    locationKey.description || ""
  );
  const [playerInfo, setPlayerInfo] = React.useState(
    locationKey.playerInfo || ""
  );
  const [isPlayerVisible, setIsPlayerVisible] = React.useState(
    locationKey.isPlayerVisible || false
  );
  const navigate = useNavigate();

  const handleSave = () => {
    track("edit_location_key");
    analytics.track("edit_location_key");
    OBR.scene.items
      .updateItems(
        (item) => item.id === locationKey.id,
        (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = { 
              locationKey: description,
              playerInfo: playerInfo,
              isPlayerVisible: isPlayerVisible
            };
          }
        }
      )
      .then(() => {
        OBR.broadcast.sendMessage(`${ID}/broadcast`, `${locationKey.id}`, {
          destination: "LOCAL",
        });
        navigate("/");
      });
  };

  analytics.page();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-0 text-gray-900 dark:text-white">Edit Location Key</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-0">Name: {locationKey.name}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Details</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <em>Markdown supported.</em>
        </p>
        <textarea
          rows={13}
          defaultValue={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Player Information</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <em>Information visible to players when enabled (Markdown supported).</em>
        </p>
        <textarea
          rows={6}
          placeholder="Enter information that players will see when this location key is made visible to them..."
          value={playerInfo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlayerInfo(e.target.value)}
          className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <label className="flex items-center mb-3 cursor-pointer">
          <input
            type="checkbox"
            id="player-visibility-checkbox"
            checked={isPlayerVisible}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsPlayerVisible(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-900 dark:text-white">Make visible to players</span>
        </label>
        <div className="grid grid-cols-4 gap-2 text-center mt-2">
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 bg-theme-primary border-2 border-theme-primary text-white rounded font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-theme-danger border-2 border-theme-danger text-white rounded font-medium transition-colors"
          >
            Cancel
          </button>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default LocationKey;
