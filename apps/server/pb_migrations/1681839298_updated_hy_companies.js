migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xyomsbq4hlrzevd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1vgtivxo",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "xyomsbq4hlrzevd",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xyomsbq4hlrzevd")

  // remove
  collection.schema.removeField("1vgtivxo")

  return dao.saveCollection(collection)
})
