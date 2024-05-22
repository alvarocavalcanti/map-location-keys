import { LocationKey } from "../@types/types";
import { saveAs } from "file-saver";
import yaml from "js-yaml";
import React from "react";
import { Button, Card, Container } from "react-bootstrap";

const ImportExport: React.FC<{
  locationKeys: LocationKey[];
}> = ({ locationKeys }) => {
  const handleExport = () => {
    const yamlText = yaml.dump(locationKeys);
    const blob = new Blob([yamlText], { type: "text/yaml;charset=utf-8" });
    saveAs(blob, "locationKeys.yaml");
  };

  const handleImport = () => {};

  return (
    <Container className="p-3">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Export</Card.Title>
          <Card.Text>
            <div className="mb-4">
              Click the button below to export your location keys as a YAML file.
            </div>
            <Button className="primary" onClick={handleExport}>
              Export
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Import</Card.Title>
          <Card.Text>
            <div className="mb-2">
              Paste the contents of a YAML file below and click the button to import location keys.
            </div>
            <div className="mb-4 alert alert-warning" role="alert">
              Importing will overwrite any existing location keys.
            </div>
            <Button className="primary disabled" onClick={handleImport}>
              Import
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ImportExport;
