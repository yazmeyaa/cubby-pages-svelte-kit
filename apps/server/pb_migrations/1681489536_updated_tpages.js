migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pccta51d2oob061")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eeudpfew",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "zizk8wpbe48jc25",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pccta51d2oob061")

  // remove
  collection.schema.removeField("eeudpfew")

  return dao.saveCollection(collection)
})
