migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fizuogfc",
    "name": "data",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zizk8wpbe48jc25")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fizuogfc",
    "name": "data",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
