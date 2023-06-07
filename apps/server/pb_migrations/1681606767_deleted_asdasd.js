migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("aj5ou3qsgerjl5n");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "aj5ou3qsgerjl5n",
    "created": "2023-04-14 14:29:27.254Z",
    "updated": "2023-04-14 14:29:27.254Z",
    "name": "asdasd",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tarwmoll",
        "name": "asd",
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
