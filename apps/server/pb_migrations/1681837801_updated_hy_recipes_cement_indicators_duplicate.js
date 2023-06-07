migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("51ucgbi17d657q0")

  collection.name = "hy_years"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_iJFv9gK` ON `hy_years` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("51ucgbi17d657q0")

  collection.name = "hy_recipes_cement_indicators_duplicate"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_iJFv9gK` ON `hy_recipes_cement_indicators_duplicate` (`name`)"
  ]

  return dao.saveCollection(collection)
})
