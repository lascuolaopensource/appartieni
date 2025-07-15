/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3702085596",
    "hidden": false,
    "id": "relation3781368977",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "checkin",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // remove field
  collection.fields.removeById("relation3781368977")

  return app.save(collection)
})
