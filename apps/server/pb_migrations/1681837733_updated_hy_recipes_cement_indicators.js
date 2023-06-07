migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // remove
  collection.schema.removeField("mntpzrz7")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mntpzrz7",
    "name": "parent_name",
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
