migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ugrk3n3d",
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
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ugrk3n3d",
    "name": "qqqq",
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
