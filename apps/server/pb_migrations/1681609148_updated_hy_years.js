migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_8Ny84cU` ON `hy_years` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  collection.indexes = []

  return dao.saveCollection(collection)
})
