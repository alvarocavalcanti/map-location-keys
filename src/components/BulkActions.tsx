import OBR from "@owlbear-rodeo/sdk";
import React from "react";
import { Button, Card, CardBody, Container } from "react-bootstrap";

import { locationKeyTemplate } from "../contextMenu";
import { ID } from "../main";

const BulkActions: React.FC = () => {
  const addAllToLocationKeys = () => {
    OBR.scene.items
      .getItems(
        (item) =>
          item.layer === "TEXT" && item.metadata[`${ID}/metadata`] === undefined
      )
      .then((itemsToAdd) => {
        OBR.scene.items
          .updateItems(itemsToAdd, (items) => {
            for (let item of items) {
              item.metadata[`${ID}/metadata`] = {
                locationKey: locationKeyTemplate,
              };
            }
          })
          .then(() => {
            OBR.notification.show(
              `Added ${itemsToAdd.length} items to location keys`,
              "INFO"
            );
          });
      });
  };

  const deleteAllLocationKeys = () => {
    if (window.confirm("Are you sure you want to delete all location keys?")) {
      OBR.scene.items
        .getItems(
          (item) =>
            item.layer === "TEXT" &&
            item.metadata[`${ID}/metadata`] != undefined
        )
        .then((itemsToRemove) => {
          OBR.scene.items
            .updateItems(itemsToRemove, (items) => {
              for (let item of items) {
                delete item.metadata[`${ID}/metadata`];
              }
            })
            .then(() => {
              OBR.notification.show(
                `Removed ${itemsToRemove.length} items from location keys`,
                "INFO"
              );
            });
        });
    }
  };

  return (
    <Container>
      <Card className="mb-4">
        <CardBody>
          <Card.Title className="header">Add All to Location Keys</Card.Title>
          <Card.Text>
            You can use the button bellow to add all TEXT items that haven't
            been added to the location keys yet.
            <br />
            <Button
              variant="primary"
              className="mt-3"
              onClick={addAllToLocationKeys}
            >
              Add All
            </Button>
          </Card.Text>
        </CardBody>
      </Card>
      <Card className="mb-4 mt-4">
        <CardBody>
          <Card.Title className="header">Delete All Location Keys</Card.Title>
          <Card.Text>
            <Button
              variant="danger"
              className="mt-3"
              onClick={deleteAllLocationKeys}
            >
              Delete All
            </Button>
          </Card.Text>
        </CardBody>
      </Card>
    </Container>
  );
};

export default BulkActions;
