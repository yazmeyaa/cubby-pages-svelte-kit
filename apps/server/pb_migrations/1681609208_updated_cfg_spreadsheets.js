migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  collection.indexes = [
    "CREATE INDEX `idx_NE0Puo8` ON `cfg_spreadsheets` (`name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vwilvsln",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
