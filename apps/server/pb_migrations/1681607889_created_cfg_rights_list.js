migrate((db) => {
  const collection = new Collection({
    "id": "vudcsnc7uj818wo",
    "created": "2023-04-16 01:18:09.453Z",
    "updated": "2023-04-16 01:18:09.453Z",
    "name": "cfg_rights_list",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tob6hiiq",
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
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo");

  return dao.deleteCollection(collection);
})
