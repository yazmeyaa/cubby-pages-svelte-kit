migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("na0t8dmhb7lsurw")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2OjvLwy` ON `cfg_groups` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("na0t8dmhb7lsurw")

  collection.indexes = []

  return dao.saveCollection(collection)
})
