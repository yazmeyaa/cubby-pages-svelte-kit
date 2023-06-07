migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kx2itugt7qvft94")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ewa3c3we",
    "name": "skills",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "s4cnorm2vrnsm2k",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "grade"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kx2itugt7qvft94")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ewa3c3we",
    "name": "skills",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "s4cnorm2vrnsm2k",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
