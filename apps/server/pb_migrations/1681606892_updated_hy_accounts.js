migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eefl3xqy",
    "name": "parent",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "sbg2vkmz01ub4qk",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  // remove
  collection.schema.removeField("eefl3xqy")

  return dao.saveCollection(collection)
})
