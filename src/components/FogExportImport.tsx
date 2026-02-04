import { FogKey } from "../@types/types";
import OBR, { buildCurve, buildPath, buildShape, Item } from "@owlbear-rodeo/sdk";
import { saveAs } from "file-saver";
import yaml, { JSON_SCHEMA } from "js-yaml";
import React from "react";
import { Link } from "react-router-dom";

import { paths } from "./util/constants";
import { track } from "@vercel/analytics";
import { analytics } from "../utils";

const FogExportImport: React.FC<{
  fogKeys: FogKey[];
}> = ({ fogKeys }) => {
  const [importYAML, setImportYAML] = React.useState("");
  const [importSuccess, setImportSuccess] = React.useState(false);
  const [inputValid, setInputValid] = React.useState(false);
  const [importError, setImportError] = React.useState("");
  const [isImporting, setIsImporting] = React.useState(false);
  const [importProgress, setImportProgress] = React.useState("");

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
    track("export_fog_keys");
    analytics.track("export_fog_keys");
    // console.log("Exporting fog keys:", fogKeys);
    // console.log("Fog keys count:", fogKeys.length);
    const yamlText = yaml.dump(fogKeys, { schema: JSON_SCHEMA });
    const blob = new Blob([yamlText], { type: "text/yaml;charset=utf-8" });
    saveAs(blob, "fogKeys.yaml");
  };

  const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleImport = async () => {
    if (importYAML.length > 0) {
      track("import_fog_keys");
      analytics.track("import_fog_keys");
      let newFogKeys: FogKey[];
      try {
        newFogKeys = yaml.load(importYAML) as FogKey[];
      } catch (e) {
        console.error("Invalid YAML:", e);
        return;
      }

      setIsImporting(true);
      setImportSuccess(false);
      setImportError("");
      setImportProgress(`Preparing to import ${newFogKeys.length} fog items...`);

      try {
        const existingItems = await OBR.scene.items.getItems((item) => {
          return item.layer === "FOG";
        });

        if (existingItems.length > 0) {
          const ids = existingItems.map((item) => item.id);
          await OBR.scene.items.deleteItems(ids);
        }

        const newItems: Item[] = [];

        for (let i = 0; i < newFogKeys.length; i++) {
          const fogKey = newFogKeys[i];
          // console.log("Processing fog key:", fogKey);
          let item: Item;

          if (fogKey.type === "SHAPE") {
            const builder = buildShape()
              .shapeType(fogKey.shapeType!)
              .width(fogKey.width!)
              .height(fogKey.height!)
              .strokeColor(fogKey.style.strokeColor)
              .strokeOpacity(fogKey.style.strokeOpacity)
              .strokeWidth(fogKey.style.strokeWidth)
              .strokeDash(fogKey.style.strokeDash)
              .fillColor(fogKey.style.fillColor)
              .fillOpacity(fogKey.style.fillOpacity)
              .layer("FOG")
              .visible(fogKey.visible ?? true)
              .name(fogKey.name);

            item = builder.build();
          } else if (fogKey.type === "PATH") {
            const builder = buildPath()
              .commands(fogKey.commands!)
              .fillRule(fogKey.fillRule!)
              .strokeColor(fogKey.style.strokeColor)
              .strokeOpacity(fogKey.style.strokeOpacity)
              .strokeWidth(fogKey.style.strokeWidth)
              .strokeDash(fogKey.style.strokeDash)
              .fillColor(fogKey.style.fillColor)
              .fillOpacity(fogKey.style.fillOpacity)
              .layer("FOG")
              .visible(fogKey.visible ?? true)
              .name(fogKey.name);

            item = builder.build();
          } else {
            const builder = buildCurve()
              .points(fogKey.points!)
              .strokeColor(fogKey.style.strokeColor)
              .strokeOpacity(fogKey.style.strokeOpacity)
              .strokeWidth(fogKey.style.strokeWidth)
              .strokeDash(fogKey.style.strokeDash)
              .fillColor(fogKey.style.fillColor)
              .fillOpacity(fogKey.style.fillOpacity)
              .layer("FOG")
              .visible(fogKey.visible ?? true)
              .name(fogKey.name);

            if (fogKey.style.tension !== undefined) {
              builder.tension(fogKey.style.tension);
            }

            item = builder.build();
          }

          if (fogKey.position) {
            item.position = fogKey.position;
          }

          if (fogKey.metadata) {
            item.metadata = fogKey.metadata;
          }

          newItems.push(item);
        }

        const CHUNK_SIZE = 10;
        const chunks = chunkArray(newItems, CHUNK_SIZE);

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          setImportProgress(`Importing batch ${i + 1} of ${chunks.length} (${chunk.length} items)...`);

          await OBR.scene.items.addItems(chunk);

          if (i < chunks.length - 1) {
            await delay(200);
          }
        }

        setImportSuccess(true);
        setImportProgress("");
      } catch (e) {
        setImportSuccess(false);
        setImportError(
          "Error importing fog items. This may be due to a large dataset - try breaking it into smaller files."
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Export Fog</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Click the button below to export your fog items as a YAML file.
        </p>
        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Import Fog</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Paste the contents of a YAML file below and click the button to
          import fog items.
        </p>
        <div className="mb-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 p-2 rounded text-yellow-800 dark:text-yellow-200">
          Importing will overwrite any existing fog items.
        </div>
        <textarea
          rows={13}
          defaultValue={importYAML}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleOnChange(e.target as HTMLTextAreaElement)}
          className={`w-full px-3 py-2 mb-4 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            inputValid ? "border-green-500" : "border-red-500"
          }`}
          id="yamlInput"
        />
        <button
          onClick={handleImport}
          disabled={!inputValid || isImporting}
          className={`px-4 py-2 rounded ${
            inputValid && !isImporting
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {isImporting ? "Importing..." : "Import"}
        </button>
        {isImporting && importProgress && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 p-3 mt-4 rounded text-blue-800 dark:text-blue-200">
            {importProgress}
          </div>
        )}
        {importSuccess ? (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 p-3 mt-4 rounded text-blue-800 dark:text-blue-200">
            Fog items successfully imported.
          </div>
        ) : (
          importError.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3 mt-4 rounded text-red-800 dark:text-red-200">
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

export default FogExportImport;
