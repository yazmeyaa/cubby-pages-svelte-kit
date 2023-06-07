migrate((db) => {
  const collection = new Collection({
    "id": "n1kc3pch7ymguv5",
    "created": "2023-04-18 17:14:05.306Z",
    "updated": "2023-04-18 17:14:05.306Z",
    "name": "hy_product_marks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yqtfkquf",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "tfce6th5",
        "name": "unit",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vzckd4uy",
        "name": "weight",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "qognlqwo",
        "name": "level_number",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "z8p4oxcv",
        "name": "is_root",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "oiuzcdvg",
        "name": "is_leaf",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "6qgxarwh",
        "name": "is_calculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_ush2evE` ON `hy_product_marks` (`name`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("n1kc3pch7ymguv5");

  return dao.deleteCollection(collection);
})
