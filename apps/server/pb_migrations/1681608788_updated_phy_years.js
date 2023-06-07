migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // remove
  collection.schema.removeField("ltvmyhnj")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ltvmyhnj",
    "name": "element",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "sbg2vkmz01ub4qk",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
