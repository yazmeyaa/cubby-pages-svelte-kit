migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pccta51d2oob061")

  collection.name = "tpages"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pccta51d2oob061")

  collection.name = "pages"

  return dao.saveCollection(collection)
})
