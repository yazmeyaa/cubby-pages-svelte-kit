migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "rjb7tqufyp4hr3t",
    "created": "2023-04-16 01:32:51.231Z",
    "updated": "2023-04-16 01:36:31.566Z",
    "name": "phy_years",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bdzzrq0m",
        "name": "element",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "rjb7tqufyp4hr3t",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "element"
          ]
        }
      },
      {
        "system": false,
        "id": "agdpj9xv",
        "name": "group",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "na0t8dmhb7lsurw",
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
        "id": "ufkysv7j",
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
      "CREATE UNIQUE INDEX `idx_3oMMN1X` ON `phy_years` (\n  `element`,\n  `group`\n)"
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
