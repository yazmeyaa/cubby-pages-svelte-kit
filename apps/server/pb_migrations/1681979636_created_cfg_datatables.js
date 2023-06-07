migrate((db) => {
  const collection = new Collection({
    "id": "9mp267us1aw6xzd",
    "created": "2023-04-20 08:33:56.786Z",
    "updated": "2023-04-20 08:33:56.786Z",
    "name": "cfg_datatables",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "avffziwi",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "qltkilka",
        "name": "data",
        "type": "json",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9mp267us1aw6xzd");

  return dao.deleteCollection(collection);
})
