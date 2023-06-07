migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qwgbcp5e",
    "name": "groups",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "na0t8dmhb7lsurw",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("qwgbcp5e")

  return dao.saveCollection(collection)
})
