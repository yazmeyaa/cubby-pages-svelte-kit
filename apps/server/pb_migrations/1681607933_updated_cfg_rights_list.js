migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.indexes = [
    "CREATE INDEX `idx_flLooZa` ON `cfg_rights_list` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.indexes = []

  return dao.saveCollection(collection)
})
