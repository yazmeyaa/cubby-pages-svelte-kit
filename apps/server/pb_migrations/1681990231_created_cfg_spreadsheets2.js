migrate((db) => {
  const collection = new Collection({
    "id": "i4sg6kx1hxy23i2",
    "created": "2023-04-20 11:30:31.932Z",
    "updated": "2023-04-20 11:30:31.932Z",
    "name": "cfg_spreadsheets2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5jtfgiop",
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
        "id": "s2kmpdda",
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
  const collection = dao.findCollectionByNameOrId("i4sg6kx1hxy23i2");

  return dao.deleteCollection(collection);
})
