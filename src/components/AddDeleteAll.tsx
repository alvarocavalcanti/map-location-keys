import OBR from "@owlbear-rodeo/sdk";
import { track } from "@vercel/analytics";
import React from "react";
import { Button, Card, CardBody, Container } from "react-bootstrap";

import { locationKeyTemplate } from "../contextMenu";
import { ID } from "../main";
import { analytics } from "../utils";

const AddDeleteAll: React.FC = () => {
  const addAllToLocationKeys = () => {
    track("add_all_to_location_keys");
    analytics.track("add_all_to_location_keys");
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
      track("delete_all_location_keys");
      analytics.track("delete_all_location_keys");
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

  analytics.page();

  return (
    <Container>
      <Card className="mb-4">
        <CardBody>
          <Card.Title className="header">
            Add all TEXT items to Location Keys
          </Card.Title>
          <Card.Text>
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
          <Card.Title className="header">Delete all Location Keys</Card.Title>
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

export default AddDeleteAll;
