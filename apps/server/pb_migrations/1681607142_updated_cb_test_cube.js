migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jke2cqz6",
    "name": "account",
    "type": "relation",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jke2cqz6",
    "name": "account",
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
})
