migrate((db) => {
  const collection = new Collection({
    "id": "6ozskx3gidp525p",
    "created": "2023-04-16 01:30:02.538Z",
    "updated": "2023-04-16 01:30:02.538Z",
    "name": "cfg_cubes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g7ytze2m",
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
        "id": "t4pry7q5",
        "name": "desctiption",
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
  const collection = dao.findCollectionByNameOrId("6ozskx3gidp525p");

  return dao.deleteCollection(collection);
})
