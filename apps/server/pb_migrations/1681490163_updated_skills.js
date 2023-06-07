migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "acamyipa",
    "name": "grade",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "vzbown1hkfgbwk7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  // remove
  collection.schema.removeField("acamyipa")

  return dao.saveCollection(collection)
})
