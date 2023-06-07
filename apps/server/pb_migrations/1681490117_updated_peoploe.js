migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kx2itugt7qvft94")

  collection.name = "people"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kx2itugt7qvft94")

  collection.name = "peoploe"

  return dao.saveCollection(collection)
})
