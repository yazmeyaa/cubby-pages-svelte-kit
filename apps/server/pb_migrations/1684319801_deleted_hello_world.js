migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("zjv9olsahiw2wpe");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "zjv9olsahiw2wpe",
    "created": "2023-05-11 10:40:35.768Z",
    "updated": "2023-05-11 10:40:35.768Z",
    "name": "hello_world",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qttbtdxg",
        "name": "field",
        "type": "editor",
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
})
