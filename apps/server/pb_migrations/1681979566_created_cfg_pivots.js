migrate((db) => {
  const collection = new Collection({
    "id": "yr9k6ubltw644wn",
    "created": "2023-04-20 08:32:46.784Z",
    "updated": "2023-04-20 08:32:46.784Z",
    "name": "cfg_pivots",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fdas1juu",
        "name": "name",
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
  const collection = dao.findCollectionByNameOrId("yr9k6ubltw644wn");

  return dao.deleteCollection(collection);
})
