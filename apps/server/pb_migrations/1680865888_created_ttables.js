migrate((db) => {
  const collection = new Collection({
    "id": "zizk8wpbe48jc25",
    "created": "2023-04-07 11:11:28.507Z",
    "updated": "2023-04-07 11:11:28.507Z",
    "name": "cfg_spreadsheets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vwilvsln",
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
        "id": "fizuogfc",
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
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25");

  return dao.deleteCollection(collection);
})
