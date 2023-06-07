migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwnxn3ed",
    "name": "parent",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "zqx31y2sh75cae3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name",
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwnxn3ed",
    "name": "parent",
    "type": "relation",
    "required": false,
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
