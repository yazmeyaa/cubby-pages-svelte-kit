migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oczlxpsl",
    "name": "year",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "zqx31y2sh75cae3",
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
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oczlxpsl",
    "name": "year",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "zqx31y2sh75cae3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
