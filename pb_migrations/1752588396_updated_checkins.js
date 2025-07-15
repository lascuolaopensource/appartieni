/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1379753955",
    "hidden": false,
    "id": "relation2442205965",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "venue",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "geoPoint2646664628",
    "name": "geolocation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1322349139",
    "max": null,
    "min": null,
    "name": "reward",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // remove field
  collection.fields.removeById("relation2442205965")

  // remove field
  collection.fields.removeById("geoPoint2646664628")

  // remove field
  collection.fields.removeById("number1322349139")

  return app.save(collection)
})
