import { useState, useEffect } from 'react';

const SHOW_PLAYER_INFO_IN_GM_VIEW_STORAGE_KEY =
  "map-location-keys-settings-playerinfo-in-gm-view";

export const usePlayerInfoInGMView = (): [boolean, React.Dispatch<boolean>] => {
  const [playerInfoInGMView, setPlayerInfoInGMView] =
    useState<boolean>(() => {
      const stored = localStorage.getItem(SHOW_PLAYER_INFO_IN_GM_VIEW_STORAGE_KEY) === "true";
      return stored;
    });

  useEffect(() => {
    localStorage.setItem(SHOW_PLAYER_INFO_IN_GM_VIEW_STORAGE_KEY, playerInfoInGMView.toString());
  }, [playerInfoInGMView]);

  return [playerInfoInGMView, setPlayerInfoInGMView ];
};
