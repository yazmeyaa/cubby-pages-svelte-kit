migrate((db) => {
  const collection = new Collection({
    "id": "g7aitosizo1fhzj",
    "created": "2023-05-23 11:49:37.829Z",
    "updated": "2023-05-23 11:49:37.829Z",
    "name": "test_collection_with_all_fields",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bgvljk3k",
        "name": "field",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 255,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "orzcl7mp",
        "name": "field1",
        "type": "editor",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "4t2wl0bj",
        "name": "field2",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 255
        }
      },
      {
        "system": false,
        "id": "ge0o9zld",
        "name": "field3",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "zfjjjtna",
        "name": "field4",
        "type": "email",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "zrt6im0a",
        "name": "field5",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "wn52jv7j",
        "name": "field6",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "pxelbpvv",
        "name": "field7",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "hello",
            "world",
            "my",
            "name",
            "is",
            "null"
          ]
        }
      },
      {
        "system": false,
        "id": "qrlm1pqb",
        "name": "field8",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "application/zip",
            "application/x-7z-compressed",
            "application/x-rar-compressed"
          ],
          "thumbs": []
        }
      },
      {
        "system": false,
        "id": "anokuzn7",
        "name": "field9",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "smypffcigrr331f",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "wpicjwa5",
        "name": "field10",
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
  const collection = dao.findCollectionByNameOrId("g7aitosizo1fhzj");

  return dao.deleteCollection(collection);
})
