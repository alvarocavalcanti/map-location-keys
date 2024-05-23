import OBR, { Item, buildText } from "@owlbear-rodeo/sdk";
import { LocationKey } from "../@types/types";
import { saveAs } from "file-saver";
import yaml from "js-yaml";
import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { ID } from "../main";
import { isDevMode } from "../utils";

const ImportExport: React.FC<{
  locationKeys: LocationKey[];
}> = ({ locationKeys }) => {
  const [importYAML, setImportYAML] = React.useState("");

  const handleOnChange = (target: HTMLTextAreaElement) => {
    try {
      yaml.load(target.value);
      setImportYAML(target.value);
    } catch (e) {
      console.error("Invalid YAML:", e);
      target.classList.add("is-invalid");
    }
  };

  const handleExport = () => {
    const yamlText = yaml.dump(locationKeys);
    const blob = new Blob([yamlText], { type: "text/yaml;charset=utf-8" });
    saveAs(blob, "locationKeys.yaml");
  };

  const handleImport = () => {
    if (importYAML.length > 0) {
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
            .then(() => {})
            .catch((e) => {
              console.error(e);
            });
        });
    }
  };

  return (
    <Container className="p-3">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Export</Card.Title>
          <Card.Text>
            Click the button below to export your location keys as a YAML file.<br className="mb-4"/>
            <Button className="primary" onClick={handleExport}>
              Export
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
      {isDevMode() ? (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Import</Card.Title>
            <Card.Text>
              <div className="mb-2">
                Paste the contents of a YAML file below and click the button to
                import location keys.
              </div>
              <div className="mb-4 alert alert-warning" role="alert">
                Importing will overwrite any existing location keys.
              </div>
              <Form.Control
                as="textarea"
                rows={13}
                defaultValue={importYAML}
                onChange={(e) =>
                  handleOnChange(e.target as HTMLTextAreaElement)
                }
                data-bs-theme="light"
                className="mb-4"
                id="yamlInput"
              />
              <Button className="primary" onClick={handleImport}>
                Import
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      ) : null}
    </Container>
  );
};

export default ImportExport;
