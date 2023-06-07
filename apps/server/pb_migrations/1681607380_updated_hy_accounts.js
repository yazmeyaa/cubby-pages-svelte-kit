migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_PiGjpWV` ON `hy_accounts` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  collection.indexes = []

  return dao.saveCollection(collection)
})
