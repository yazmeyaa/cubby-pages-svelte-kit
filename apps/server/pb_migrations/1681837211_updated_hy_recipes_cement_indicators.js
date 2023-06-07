migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // remove
  collection.schema.removeField("rgzxczt8")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rgzxczt8",
    "name": "parent_id",
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
