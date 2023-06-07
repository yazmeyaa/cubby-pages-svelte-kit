migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vts0y9dq",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "t4t8acjwcyacq17",
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
  const collection = dao.findCollectionByNameOrId("t4t8acjwcyacq17")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vts0y9dq",
    "name": "parent_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "t4t8acjwcyacq17",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
