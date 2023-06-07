migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  collection.name = "phy_accounts"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9h9x4ciqzmb1dal")

  collection.name = "rhy_accounts"

  return dao.saveCollection(collection)
})
