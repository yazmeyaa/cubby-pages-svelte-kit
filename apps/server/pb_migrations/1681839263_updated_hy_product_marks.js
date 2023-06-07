migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n1kc3pch7ymguv5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jbvmejwa",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "n1kc3pch7ymguv5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n1kc3pch7ymguv5")

  // remove
  collection.schema.removeField("jbvmejwa")

  return dao.saveCollection(collection)
})
