migrate((db) => {
  const collection = new Collection({
    "id": "s4cnorm2vrnsm2k",
    "created": "2023-04-14 16:24:09.880Z",
    "updated": "2023-04-14 16:24:09.880Z",
    "name": "1111",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ugrk3n3d",
        "name": "qqqq",
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
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k");

  return dao.deleteCollection(collection);
})
