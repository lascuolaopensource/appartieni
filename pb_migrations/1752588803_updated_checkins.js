/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "geoPoint2646664628",
    "name": "geo",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "geoPoint2646664628",
    "name": "geolocation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  return app.save(collection)
})
