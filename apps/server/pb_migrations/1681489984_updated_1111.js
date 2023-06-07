migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  collection.name = "skills"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s4cnorm2vrnsm2k")

  collection.name = "1111"

  return dao.saveCollection(collection)
})
