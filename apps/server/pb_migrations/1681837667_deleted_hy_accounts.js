migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "sbg2vkmz01ub4qk",
    "created": "2023-04-16 01:00:25.171Z",
    "updated": "2023-04-16 01:09:40.236Z",
    "name": "hy_accounts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3yc8n7wg",
        "name": "name",
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
        "id": "eefl3xqy",
        "name": "parent",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "sbg2vkmz01ub4qk",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "st7ucsjs",
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
        "id": "zbrgarnd",
        "name": "isCalculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "7tkzhwmp",
        "name": "isConsolidated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_PiGjpWV` ON `hy_accounts` (`name`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
