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

  const handleOnChange = (target: HTMLTextAreaElement) => {
    setImportSuccess(false);
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

  const handleImport = () => {
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

      OBR.scene.items
        .getItems((item) => {
          return (
            item.layer === "TEXT" &&
            item.metadata[`${ID}/metadata`] != undefined
          );
        })
        .then((items) => {
          const ids = items.map((item) => item.id);
          OBR.scene.items.deleteItems(ids);

          const newItems: Item[] = [];
          const initialPosition: { x: number; y: number } = { x: 0, y: 0 };
          for (let locationKey of newLocationKeys) {
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
            };
            item.position = { x: initialPosition.x, y: initialPosition.y };
            initialPosition.x += 100;

            newItems.push(item);
          }

          OBR.scene.items
            .addItems(newItems)
            .then(() => {
              setImportSuccess(true);
            })
            .catch((e) => {
              setImportSuccess(false);
              setImportError(
                "Error importing location keys. Make sure they are valid."
              );
              console.error(e);
            });
        });
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
            className={`primary ${inputValid ? "enabled" : "disabled"}`}
            onClick={handleImport}
          >
            Import
          </Button>
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
