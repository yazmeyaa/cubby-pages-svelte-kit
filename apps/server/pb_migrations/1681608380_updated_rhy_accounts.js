migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jtio0qnv",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fala34rc",
    "name": "permition",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vudcsnc7uj818wo",
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
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jtio0qnv",
    "name": "group",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "na0t8dmhb7lsurw",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fala34rc",
    "name": "permition",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "vudcsnc7uj818wo",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
