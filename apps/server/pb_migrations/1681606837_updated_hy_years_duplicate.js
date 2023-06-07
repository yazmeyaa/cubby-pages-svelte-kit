migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  collection.name = "hy_accounts"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sbg2vkmz01ub4qk")

  collection.name = "hy_years_duplicate"

  return dao.saveCollection(collection)
})
