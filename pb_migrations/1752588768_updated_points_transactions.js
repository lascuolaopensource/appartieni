/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2627482601",
    "hidden": false,
    "id": "relation3559883025",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "service_request_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // remove field
  collection.fields.removeById("relation3559883025")

  return app.save(collection)
})
