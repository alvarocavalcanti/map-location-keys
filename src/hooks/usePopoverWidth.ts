import { useState, useEffect } from 'react';
import OBR from '@owlbear-rodeo/sdk';

const POPOVER_WIDTH_STORAGE_KEY = "map-location-keys-settings-popover-width";

export const usePopoverWidth = (): [number, React.Dispatch<number>] => {
  const [width, setWidth] = useState<number>(() => {
    const stored = localStorage.getItem(POPOVER_WIDTH_STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    return Number.isFinite(parsed) ? parsed : 500;
  });

  useEffect(() => {
    localStorage.setItem(POPOVER_WIDTH_STORAGE_KEY, width.toString());
    OBR.action.setWidth(width).catch(() => {
      // Popover resize unavailable (e.g. running outside OBR) - ignore
    });
  }, [width]);

  return [width, setWidth];
};
