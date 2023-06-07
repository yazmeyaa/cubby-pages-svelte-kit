migrate((db) => {
  const collection = new Collection({
    "id": "sbg2vkmz01ub4qk",
    "created": "2023-04-16 01:00:25.171Z",
    "updated": "2023-04-16 01:00:25.171Z",
    "name": "hy_years_duplicate",
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
        "id": "xk0wov7s",
        "name": "parent",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "zqx31y2sh75cae3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name",
            "id"
          ]
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
    "indexes": [],
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
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk");

  return dao.deleteCollection(collection);
})
