migrate((db) => {
  const collection = new Collection({
    "id": "xyomsbq4hlrzevd",
    "created": "2023-04-18 17:10:45.135Z",
    "updated": "2023-04-18 17:10:45.135Z",
    "name": "hy_companies",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "e0epuyvx",
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
        "id": "svb2s39r",
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
        "id": "boksqjaf",
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
        "id": "sao0onfh",
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
        "id": "w6xuqa2l",
        "name": "is_root",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "kwvdkhfq",
        "name": "is_leaf",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "gs3lymun",
        "name": "is_calculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_XnZk36Y` ON `hy_companies` (`name`)"
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
  const collection = dao.findCollectionByNameOrId("xyomsbq4hlrzevd");

  return dao.deleteCollection(collection);
})
