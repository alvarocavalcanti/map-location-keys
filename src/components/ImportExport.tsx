import { LocationKey } from "../@types/types";
import OBR, { buildText, Item } from "@owlbear-rodeo/sdk";
import { saveAs } from "file-saver";
import yaml, { JSON_SCHEMA } from "js-yaml";
import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
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
    console.log("Valid YAML");
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
          const item = buildText()
            .richText([
              {
                type: "paragraph",
                children: [{ text: locationKey.name }],
              },
            ])
            // TODO: Parametrise
            .fillColor("red")
            .fontSize(120)
            .fontWeight(700)
            .strokeColor("white")
            .strokeWidth(20)
            .build();
          item.metadata[`${ID}/metadata`] = {
            locationKey: locationKey.description,
            playerInfo: locationKey.playerInfo || "",
            isPlayerVisible: locationKey.isPlayerVisible || false,
          };

          // Use staircase positioning instead of linear
          const position = calculateStaircasePosition(i, newLocationKeys.length, startPosition);
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
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Export</Card.Title>
          <Card.Text>
            Click the button below to export your location keys as a YAML file.
            <br className="mb-4" />
            <Button className="primary" onClick={handleExport}>
              Export
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Import</Card.Title>
          <Card.Text className="mb-2">
            Paste the contents of a YAML file below and click the button to
            import location keys.
          </Card.Text>
          <Container className="mb-4 alert alert-warning" role="alert">
            Importing will overwrite any existing location keys.
          </Container>
          <Form.Control
            as="textarea"
            rows={13}
            defaultValue={importYAML}
            onChange={(e) => handleOnChange(e.target as HTMLTextAreaElement)}
            data-bs-theme="light"
            className={`mb-4 ${inputValid ? "is-valid" : "is-invalid"}`}
            id="yamlInput"
          />
          <Button
            className={`primary ${inputValid && !isImporting ? "enabled" : "disabled"}`}
            onClick={handleImport}
            disabled={!inputValid || isImporting}
          >
            {isImporting ? "Importing..." : "Import"}
          </Button>
          {isImporting && importProgress && (
            <Container className="alert alert-info p-3 mt-4">
              {importProgress}
            </Container>
          )}
          {importSuccess ? (
            <Container className="alert alert-info p-3 mt-4">
              Location keys successfully imported.
              <br />
              <br />
              The text items were added to the map at the top left corner. You
              can move them around as needed.
            </Container>
          ) : (
            importError.length > 0 && (
              <Container className="alert alert-danger p-3 mt-4">
                {importError}
                <br />
                See the{" "}
                <Link to={paths.help} className="alert-link">
                  Help
                </Link>{" "}
                page for more information.
              </Container>
            )
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ImportExport;
