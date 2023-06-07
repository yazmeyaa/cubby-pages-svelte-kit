migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yr9k6ubltw644wn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nszgmkmy",
    "name": "data",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yr9k6ubltw644wn")

  // remove
  collection.schema.removeField("nszgmkmy")

  return dao.saveCollection(collection)
})
