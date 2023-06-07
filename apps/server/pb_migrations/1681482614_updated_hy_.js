migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  collection.name = "hy_asdasdsa"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zqx31y2sh75cae3")

  collection.name = "hy_"

  return dao.saveCollection(collection)
})
