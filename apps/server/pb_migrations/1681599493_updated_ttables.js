migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  collection.name = "cfg_spreadsheets"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  collection.name = "cfg_spreadsheets"

  return dao.saveCollection(collection)
})
