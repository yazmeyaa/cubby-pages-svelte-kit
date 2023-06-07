migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "9h9x4ciqzmb1dal",
    "created": "2023-04-16 01:21:45.259Z",
    "updated": "2023-04-16 01:37:38.062Z",
    "name": "phy_accounts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mtupx4f6",
        "name": "element",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "sbg2vkmz01ub4qk",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
        }
      },
      {
        "system": false,
        "id": "jtio0qnv",
        "name": "group",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "na0t8dmhb7lsurw",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "fala34rc",
        "name": "permition",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "vudcsnc7uj818wo",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_cafRiVP` ON `phy_accounts` (\n  `element`,\n  `group`\n)"
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
