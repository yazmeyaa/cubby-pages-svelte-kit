migrate((db) => {
  const collection = new Collection({
    "id": "62k67na01bfp0fm",
    "created": "2023-04-18 17:14:31.366Z",
    "updated": "2023-04-18 17:14:31.366Z",
    "name": "hy_months",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gpqbcmyi",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "kfcexvi1",
        "name": "unit",
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
        "id": "7lhrybhd",
        "name": "weight",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "no27ahpt",
        "name": "level_number",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "u4u8dvvb",
        "name": "is_root",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ux9glcxt",
        "name": "is_leaf",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "h610li5x",
        "name": "is_calculated",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_uZSRj3r` ON `hy_months` (`name`)"
    ],
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
  const collection = dao.findCollectionByNameOrId("62k67na01bfp0fm");

  return dao.deleteCollection(collection);
})
