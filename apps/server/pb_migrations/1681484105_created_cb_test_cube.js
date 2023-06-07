migrate((db) => {
  const collection = new Collection({
    "id": "1g1q7pcdkzglfaa",
    "created": "2023-04-14 14:55:05.954Z",
    "updated": "2023-04-14 14:55:05.954Z",
    "name": "cb_test_cube",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oczlxpsl",
        "name": "data",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "zqx31y2sh75cae3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "5zhf4dzl",
        "name": "amount",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa");

  return dao.deleteCollection(collection);
})
