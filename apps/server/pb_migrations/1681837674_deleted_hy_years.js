migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "zqx31y2sh75cae3",
    "created": "2023-04-14 14:29:52.973Z",
    "updated": "2023-04-16 01:39:08.195Z",
    "name": "hy_years",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6fxi9omo",
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
        "id": "dwnxn3ed",
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
        "id": "rj3s2kh1",
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
        "id": "h4enledv",
        "name": "isCalculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "acsaq3ju",
        "name": "isConsolidated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_8Ny84cU` ON `hy_years` (`name`)"
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
