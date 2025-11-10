import { FogKey } from "../@types/types";
import OBR, { buildCurve, buildPath, buildShape, Item } from "@owlbear-rodeo/sdk";
import { saveAs } from "file-saver";
import yaml, { JSON_SCHEMA } from "js-yaml";
import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
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
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Export Fog</Card.Title>
          <Card.Text>
            Click the button below to export your fog items as a YAML file.
            <br className="mb-4" />
            <Button className="primary" onClick={handleExport}>
              Export
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Import Fog</Card.Title>
          <Card.Text className="mb-2">
            Paste the contents of a YAML file below and click the button to
            import fog items.
          </Card.Text>
          <Container className="mb-4 alert alert-warning" role="alert">
            Importing will overwrite any existing fog items.
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
              Fog items successfully imported.
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

export default FogExportImport;
