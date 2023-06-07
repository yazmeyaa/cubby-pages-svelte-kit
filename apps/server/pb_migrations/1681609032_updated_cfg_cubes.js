migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6ozskx3gidp525p")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_jGrvm1v` ON `cfg_cubes` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6ozskx3gidp525p")

  collection.indexes = [
    "CREATE INDEX `idx_Qu2aiUW` ON `cfg_cubes` (`name`)"
  ]

  return dao.saveCollection(collection)
})
