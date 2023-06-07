migrate((db) => {
  const collection = new Collection({
    "id": "51ucgbi17d657q0",
    "created": "2023-04-18 17:09:13.026Z",
    "updated": "2023-04-18 17:09:13.026Z",
    "name": "hy_recipes_cement_indicators_duplicate",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dictontz",
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
        "id": "hotbt2yt",
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
        "id": "p5re5kuo",
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
        "id": "ziejjwyc",
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
        "id": "scpw3nru",
        "name": "is_root",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "qr1pfbav",
        "name": "is_leaf",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "jheni53p",
        "name": "is_calculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_iJFv9gK` ON `hy_recipes_cement_indicators_duplicate` (`name`)"
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
  const collection = dao.findCollectionByNameOrId("51ucgbi17d657q0");

  return dao.deleteCollection(collection);
})
