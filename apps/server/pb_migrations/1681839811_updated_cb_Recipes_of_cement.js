migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smypffcigrr331f")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_R20jeKp` ON `cb_Recipes_of_cement` (\n  `el_years`,\n  `el_month`,\n  `el_companies`,\n  `el_recipes_cement_indicators`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smypffcigrr331f")

  collection.indexes = []

  return dao.saveCollection(collection)
})
