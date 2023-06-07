migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6ozskx3gidp525p")

  collection.indexes = [
    "CREATE INDEX `idx_Qu2aiUW` ON `cfg_cubes` (`name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g7ytze2m",
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
  const collection = dao.findCollectionByNameOrId("6ozskx3gidp525p")

  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g7ytze2m",
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
