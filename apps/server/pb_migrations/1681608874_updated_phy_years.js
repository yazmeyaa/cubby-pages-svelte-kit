migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bdzzrq0m",
    "name": "element",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "rjb7tqufyp4hr3t",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bdzzrq0m",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "rjb7tqufyp4hr3t",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
