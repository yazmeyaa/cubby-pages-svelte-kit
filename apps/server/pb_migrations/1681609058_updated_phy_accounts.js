migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_cafRiVP` ON `phy_accounts` (\n  `element`,\n  `group`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  collection.indexes = []

  return dao.saveCollection(collection)
})
