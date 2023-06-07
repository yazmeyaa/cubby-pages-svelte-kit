migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "s4cnorm2vrnsm2k",
    "created": "2023-04-14 16:24:09.880Z",
    "updated": "2023-04-14 16:40:13.550Z",
    "name": "skills",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ugrk3n3d",
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
        "id": "acamyipa",
        "name": "grade",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "vzbown1hkfgbwk7",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "oryd2idq",
        "name": "field",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "good",
            "bad",
            "ok"
          ]
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
