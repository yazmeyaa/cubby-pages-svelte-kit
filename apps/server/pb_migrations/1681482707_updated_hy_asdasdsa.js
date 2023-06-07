migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rj3s2kh1",
    "name": "weight",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h4enledv",
    "name": "isCalculated",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "acsaq3ju",
    "name": "isConsolidated",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // remove
  collection.schema.removeField("rj3s2kh1")

  // remove
  collection.schema.removeField("h4enledv")

  // remove
  collection.schema.removeField("acsaq3ju")

  return dao.saveCollection(collection)
})
