migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzbown1hkfgbwk7")

  collection.name = "grade"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vzbown1hkfgbwk7")

  collection.name = "2222"

  return dao.saveCollection(collection)
})
