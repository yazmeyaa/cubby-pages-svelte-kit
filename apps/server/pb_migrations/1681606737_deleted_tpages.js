migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pccta51d2oob061");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "pccta51d2oob061",
    "created": "2023-04-07 10:25:55.078Z",
    "updated": "2023-04-14 16:25:56.605Z",
    "name": "tpages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qs8llh4b",
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
        "id": "kjhcfveu",
        "name": "data",
        "type": "editor",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "eeudpfew",
        "name": "field",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "zizk8wpbe48jc25",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
