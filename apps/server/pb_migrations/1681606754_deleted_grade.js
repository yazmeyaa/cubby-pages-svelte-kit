migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vzbown1hkfgbwk7");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "vzbown1hkfgbwk7",
    "created": "2023-04-14 16:24:19.098Z",
    "updated": "2023-04-14 16:34:41.436Z",
    "name": "grade",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0qtq7sl8",
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
})
