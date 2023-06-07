migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6fxi9omo",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6fxi9omo",
    "name": "title",
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
