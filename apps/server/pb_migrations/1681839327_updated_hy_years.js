migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("51ucgbi17d657q0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g6cqt0kp",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "51ucgbi17d657q0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("51ucgbi17d657q0")

  // remove
  collection.schema.removeField("g6cqt0kp")

  return dao.saveCollection(collection)
})
