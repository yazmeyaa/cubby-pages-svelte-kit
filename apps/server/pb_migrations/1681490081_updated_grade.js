migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzbown1hkfgbwk7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0qtq7sl8",
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
  const collection = dao.findCollectionByNameOrId("vzbown1hkfgbwk7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0qtq7sl8",
    "name": "field",
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
