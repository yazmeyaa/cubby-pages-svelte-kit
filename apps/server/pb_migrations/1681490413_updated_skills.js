migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oryd2idq",
    "name": "field",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "good",
        "bad",
        "ok"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // remove
  collection.schema.removeField("oryd2idq")

  return dao.saveCollection(collection)
})
