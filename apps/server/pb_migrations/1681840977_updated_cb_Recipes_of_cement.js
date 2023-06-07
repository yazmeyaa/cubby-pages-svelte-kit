migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smypffcigrr331f")

  collection.indexes = []

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3mxrepz4",
    "name": "el_product_marks",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "n1kc3pch7ymguv5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smypffcigrr331f")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_R20jeKp` ON `cb_Recipes_of_cement` (\n  `el_years`,\n  `el_month`,\n  `el_companies`,\n  `el_recipes_cement_indicators`\n)"
  ]

  // remove
  collection.schema.removeField("3mxrepz4")

  return dao.saveCollection(collection)
})
