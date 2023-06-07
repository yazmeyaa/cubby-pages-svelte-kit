migrate((db) => {
  const collection = new Collection({
    "id": "smypffcigrr331f",
    "created": "2023-04-18 17:42:43.921Z",
    "updated": "2023-04-18 17:42:43.921Z",
    "name": "cb_Recipes_of_cement",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hn8z2bgc",
        "name": "el_years",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "51ucgbi17d657q0",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "ux8cwbmf",
        "name": "el_month",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "62k67na01bfp0fm",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "rdkkgycg",
        "name": "el_companies",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "xyomsbq4hlrzevd",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "nglgxryt",
        "name": "el_recipes_cement_indicators",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "t4t8acjwcyacq17",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "eakcknel",
        "name": "amount",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "umy2qvuu",
        "name": "meta",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ilnezeg6",
        "name": "is_leaf",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("smypffcigrr331f");

  return dao.deleteCollection(collection);
})
