migrate((db) => {
  const collection = new Collection({
    "id": "mhnwdulpjlpjyvv",
    "created": "2023-05-18 09:03:41.819Z",
    "updated": "2023-05-18 09:03:41.819Z",
    "name": "something",
    "type": "view",
    "system": false,
    "schema": [],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id FROM users;"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mhnwdulpjlpjyvv");

  return dao.deleteCollection(collection);
})
