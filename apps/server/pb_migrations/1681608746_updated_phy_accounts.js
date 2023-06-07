migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mtupx4f6",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mtupx4f6",
    "name": "name",
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
