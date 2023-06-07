migrate((db) => {
  const collection = new Collection({
    "id": "9h9x4ciqzmb1dal",
    "created": "2023-04-16 01:21:45.259Z",
    "updated": "2023-04-16 01:21:45.259Z",
    "name": "rhy_accounts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wqsdgoo2",
        "name": "field",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
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
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal");

  return dao.deleteCollection(collection);
})
