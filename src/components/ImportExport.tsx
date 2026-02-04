import { LocationKey } from "../@types/types";
import OBR, { buildText, Item } from "@owlbear-rodeo/sdk";
import { saveAs } from "file-saver";
import yaml, { JSON_SCHEMA } from "js-yaml";
import React from "react";
import { Link } from "react-router-dom";

import { ID } from "../main";
import { paths } from "./util/constants";
import { track } from "@vercel/analytics";
import { analytics } from "../utils";

const ImportExport: React.FC<{
  locationKeys: LocationKey[];
}> = ({ locationKeys }) => {
  const [importYAML, setImportYAML] = React.useState("");
  const [importSuccess, setImportSuccess] = React.useState(false);
  const [inputValid, setInputValid] = React.useState(false);
  const [importError, setImportError] = React.useState("");
  const [isImporting, setIsImporting] = React.useState(false);
  const [importProgress, setImportProgress] = React.useState("");
  const [importAsHidden, setImportAsHidden] = React.useState(true);

  const handleOnChange = (target: HTMLTextAreaElement) => {
    setImportSuccess(false);
    setImportError("");
    setImportProgress("");
    if (target.value.length === 0) {
      setInputValid(false);
      return;
    }
    yaml.load(target.value, {
      schema: JSON_SCHEMA,
      onWarning(e) {
        console.error("Invalid YAML:", e);
        setInputValid(false);
      },
    });
    // console.log("Valid YAML");
    setImportYAML(target.value);
    setInputValid(true);
  };

  const handleExport = () => {
    track("export_location_keys");
    analytics.track("export_location_keys");
    const yamlText = yaml.dump(locationKeys, { schema: JSON_SCHEMA });
    const blob = new Blob([yamlText], { type: "text/yaml;charset=utf-8" });
    saveAs(blob, "locationKeys.yaml");
  };

  const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const calculateStaircasePosition = (
    index: number,
    totalItems: number,
    startPosition: { x: number; y: number } = { x: 0, y: 0 }
  ): { x: number; y: number } => {
    // Configuration for staircase layout
    const itemSpacing = { x: 150, y: 80 }; // Horizontal and vertical step size
    const estimatedViewportWidth = 2000; // Reasonable default for OBR viewport width
    const maxStaircaseColumns = 8; // Maximum columns before starting new staircase

    // Calculate optimal staircase length based on total items and viewport
    const idealStaircaseLength = Math.min(
      Math.ceil(Math.sqrt(totalItems)),
      Math.floor(estimatedViewportWidth / (itemSpacing.x * 2)),
      maxStaircaseColumns
    );

    // Ensure minimum staircase length for small imports
    const staircaseLength = Math.max(idealStaircaseLength, Math.min(4, totalItems));

    // Calculate position within the staircase pattern
    const stairStep = index % staircaseLength; // Position within current staircase (0 to staircaseLength-1)
    const staircaseNumber = Math.floor(index / staircaseLength); // Which staircase (column group)

    // Calculate final position
    const position = {
      x: startPosition.x + (staircaseNumber * itemSpacing.x * 2.5) + (stairStep * itemSpacing.x),
      y: startPosition.y + (stairStep * itemSpacing.y)
    };

    return position;
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleImport = async () => {
    if (importYAML.length > 0) {
      track("import_location_keys");
      analytics.track("import_location_keys");
      let newLocationKeys: LocationKey[];
      try {
        newLocationKeys = yaml.load(importYAML) as LocationKey[];
      } catch (e) {
        console.error("Invalid YAML:", e);
        return;
      }

      setIsImporting(true);
      setImportSuccess(false);
      setImportError("");
      setImportProgress(`Preparing to import ${newLocationKeys.length} location keys...`);

      try {
        // Delete existing location keys
        const existingItems = await OBR.scene.items.getItems((item) => {
          return (
            item.layer === "TEXT" &&
            item.metadata[`${ID}/metadata`] != undefined
          );
        });

        if (existingItems.length > 0) {
          const ids = existingItems.map((item) => item.id);
          await OBR.scene.items.deleteItems(ids);
        }

        // Build all items first
        const newItems: Item[] = [];
        const startPosition: { x: number; y: number } = { x: 100, y: 100 }; // Start with margin from top-left

        for (let i = 0; i < newLocationKeys.length; i++) {
          const locationKey = newLocationKeys[i];
          const builder = buildText()
            .richText([
              {
                type: "paragraph",
                children: [{ text: locationKey.name }],
              },
            ]);

          // Apply saved style if available, otherwise use defaults
          if (locationKey.style) {
            builder
              .fillColor(locationKey.style.fillColor)
              .fillOpacity(locationKey.style.fillOpacity)
              .strokeColor(locationKey.style.strokeColor)
              .strokeOpacity(locationKey.style.strokeOpacity)
              .strokeWidth(locationKey.style.strokeWidth)
              .textAlign(locationKey.style.textAlign)
              .textAlignVertical(locationKey.style.textAlignVertical)
              .fontFamily(locationKey.style.fontFamily)
              .fontSize(locationKey.style.fontSize)
              .fontWeight(locationKey.style.fontWeight)
              .lineHeight(locationKey.style.lineHeight)
              .padding(locationKey.style.padding);
          } else {
            builder
              .fillColor("red")
              .fontSize(120)
              .fontWeight(700)
              .strokeColor("white")
              .strokeWidth(20);
          }

          // Apply text size if available
          if (locationKey.textSize) {
            builder.width(locationKey.textSize.width).height(locationKey.textSize.height);
          }

          // Apply visibility based on checkbox and YAML value
          builder.visible(importAsHidden ? false : (locationKey.visible ?? true));

          const item = builder.build();
          item.metadata[`${ID}/metadata`] = {
            locationKey: locationKey.description,
            playerInfo: locationKey.playerInfo || "",
            isPlayerVisible: locationKey.isPlayerVisible || false,
          };

          // Use saved position if available, otherwise use staircase positioning
          const position = locationKey.position || calculateStaircasePosition(i, newLocationKeys.length, startPosition);
          item.position = position;

          newItems.push(item);
        }

        // Import in chunks to avoid "max update size exceeded" error
        const CHUNK_SIZE = 10;
        const chunks = chunkArray(newItems, CHUNK_SIZE);

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          setImportProgress(`Importing batch ${i + 1} of ${chunks.length} (${chunk.length} items)...`);

          await OBR.scene.items.addItems(chunk);

          // Add small delay between chunks to prevent rate limiting
          if (i < chunks.length - 1) {
            await delay(200);
          }
        }

        setImportSuccess(true);
        setImportProgress("");
      } catch (e) {
        setImportSuccess(false);
        setImportError(
          "Error importing location keys. This may be due to a large dataset - try breaking it into smaller files."
        );
        setImportProgress("");
        console.error("Import error:", e);
      } finally {
        setIsImporting(false);
      }
    }
  };

  analytics.page();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Export</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Click the button below to export your location keys as a YAML file.
        </p>
        <button onClick={handleExport} className="px-4 py-2 bg-theme-primary border-2 border-theme-primary text-white rounded font-medium transition-colors">
          Export
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Import</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Paste the contents of a YAML file below and click the button to
          import location keys.
        </p>
        <div className="mb-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 p-2 rounded text-yellow-800 dark:text-yellow-200">
          Importing will overwrite any existing location keys.
        </div>
        <textarea
          rows={13}
          defaultValue={importYAML}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleOnChange(e.target as HTMLTextAreaElement)}
          className={`w-full px-3 py-2 mb-3 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            inputValid ? "border-green-500" : "border-red-500"
          }`}
          id="yamlInput"
        />
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            id="importAsHiddenCheckbox"
            checked={importAsHidden}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImportAsHidden(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-900 dark:text-white">Import as hidden (not visible in scene)</span>
        </label>
        <button
          onClick={handleImport}
          disabled={!inputValid || isImporting}
          className={`px-4 py-2 rounded border-2 font-medium transition-colors ${
            inputValid && !isImporting
              ? "bg-theme-primary border-theme-primary text-white"
              : "bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {isImporting ? "Importing..." : "Import"}
        </button>
        {isImporting && importProgress && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 p-2 mt-3 rounded text-blue-800 dark:text-blue-200">
            {importProgress}
          </div>
        )}
        {importSuccess ? (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 p-2 mt-3 rounded text-blue-800 dark:text-blue-200">
            Location keys successfully imported.
            <br />
            <br />
            The text items were added to the map at the top left corner. You
            can move them around as needed.
          </div>
        ) : (
          importError.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-2 mt-3 rounded text-red-800 dark:text-red-200">
              {importError}
              <br />
              See the{" "}
              <Link to={paths.help} className="text-red-700 dark:text-red-300 underline">
                Help
              </Link>{" "}
              page for more information.
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ImportExport;
