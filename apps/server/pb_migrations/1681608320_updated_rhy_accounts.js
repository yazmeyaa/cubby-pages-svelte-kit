migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // remove
  collection.schema.removeField("wqsdgoo2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mtupx4f6",
    "name": "name",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "sbg2vkmz01ub4qk",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
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

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wqsdgoo2",
    "name": "field",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("mtupx4f6")

  // remove
  collection.schema.removeField("jtio0qnv")

  // remove
  collection.schema.removeField("fala34rc")

  return dao.saveCollection(collection)
})
