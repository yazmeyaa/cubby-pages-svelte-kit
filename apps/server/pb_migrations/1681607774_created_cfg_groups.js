migrate((db) => {
  const collection = new Collection({
    "id": "na0t8dmhb7lsurw",
    "created": "2023-04-16 01:16:14.870Z",
    "updated": "2023-04-16 01:16:14.870Z",
    "name": "cfg_groups",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pp4tn4ao",
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
        "id": "mcocppuz",
        "name": "description",
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
  const collection = dao.findCollectionByNameOrId("na0t8dmhb7lsurw");

  return dao.deleteCollection(collection);
})
