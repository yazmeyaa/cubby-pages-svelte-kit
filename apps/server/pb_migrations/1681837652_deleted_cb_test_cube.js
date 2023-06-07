migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "1g1q7pcdkzglfaa",
    "created": "2023-04-14 14:55:05.954Z",
    "updated": "2023-04-16 01:39:37.379Z",
    "name": "cb_test_cube",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oczlxpsl",
        "name": "year",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "zqx31y2sh75cae3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
        }
      },
      {
        "system": false,
        "id": "jke2cqz6",
        "name": "account",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "sbg2vkmz01ub4qk",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
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
    "indexes": [
      "CREATE UNIQUE INDEX `idx_2w0eYqd` ON `cb_test_cube` (\n  `year`,\n  `account`\n)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
