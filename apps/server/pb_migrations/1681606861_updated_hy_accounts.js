migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  // remove
  collection.schema.removeField("xk0wov7s")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xk0wov7s",
    "name": "parent",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "zqx31y2sh75cae3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name",
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
