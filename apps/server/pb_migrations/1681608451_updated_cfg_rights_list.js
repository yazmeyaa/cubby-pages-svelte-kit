migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.name = "cfg_permitionList"
  collection.indexes = [
    "CREATE INDEX `idx_flLooZa` ON `cfg_permitionList` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vudcsnc7uj818wo")

  collection.name = "cfg_rights_list"
  collection.indexes = [
    "CREATE INDEX `idx_flLooZa` ON `cfg_rights_list` (`name`)"
  ]

  return dao.saveCollection(collection)
})
