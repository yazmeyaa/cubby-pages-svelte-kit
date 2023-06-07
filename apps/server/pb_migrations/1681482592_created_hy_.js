migrate((db) => {
  const collection = new Collection({
    "id": "zqx31y2sh75cae3",
    "created": "2023-04-14 14:29:52.973Z",
    "updated": "2023-04-14 14:29:52.973Z",
    "name": "hy_",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6fxi9omo",
        "name": "title",
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
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3");

  return dao.deleteCollection(collection);
})
