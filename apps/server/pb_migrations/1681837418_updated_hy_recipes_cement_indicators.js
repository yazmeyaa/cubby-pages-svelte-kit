migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_xjh3HsB` ON `hy_recipes_cement_indicators` (`name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ibfvr7aw",
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
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ibfvr7aw",
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
