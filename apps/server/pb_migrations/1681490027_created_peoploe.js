migrate((db) => {
  const collection = new Collection({
    "id": "kx2itugt7qvft94",
    "created": "2023-04-14 16:33:47.136Z",
    "updated": "2023-04-14 16:33:47.136Z",
    "name": "peoploe",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vpqvpltp",
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
        "id": "ewa3c3we",
        "name": "skills",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "s4cnorm2vrnsm2k",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("kx2itugt7qvft94");

  return dao.deleteCollection(collection);
})
