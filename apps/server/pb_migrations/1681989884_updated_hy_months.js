migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("62k67na01bfp0fm")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vb1wklgc",
    "name": "parent",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "62k67na01bfp0fm",
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
  const collection = dao.findCollectionByNameOrId("62k67na01bfp0fm")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vb1wklgc",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "62k67na01bfp0fm",
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
