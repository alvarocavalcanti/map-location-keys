import OBR from "@owlbear-rodeo/sdk";
import { track } from "@vercel/analytics";
import React from "react";

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
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Add all TEXT items to Location Keys
        </h2>
        <button
          onClick={addAllToLocationKeys}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add All
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Delete all Location Keys</h2>
        <button
          onClick={deleteAllLocationKeys}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete All
        </button>
      </div>
    </>
  );
};

export default AddDeleteAll;
