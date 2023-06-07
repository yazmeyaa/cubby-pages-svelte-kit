migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_2w0eYqd` ON `cb_test_cube` (\n  `year`,\n  `account`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1g1q7pcdkzglfaa")

  collection.indexes = []

  return dao.saveCollection(collection)
})
