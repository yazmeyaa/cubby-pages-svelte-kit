migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "agdpj9xv",
    "name": "group",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "na0t8dmhb7lsurw",
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
  const collection = dao.findCollectionByNameOrId("rjb7tqufyp4hr3t")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "agdpj9xv",
    "name": "group",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "na0t8dmhb7lsurw",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
