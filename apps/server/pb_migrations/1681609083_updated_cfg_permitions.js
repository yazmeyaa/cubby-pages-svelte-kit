migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_36liOui` ON `cfg_permitions` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.indexes = [
    "CREATE INDEX `idx_flLooZa` ON `cfg_permitions` (`name`)"
  ]

  return dao.saveCollection(collection)
})
