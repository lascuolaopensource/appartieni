/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1211288500",
    "max": null,
    "min": null,
    "name": "delta_points",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2371146282",
    "maxSelect": 1,
    "name": "source_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "checkin",
      "service"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1576967458")

  // remove field
  collection.fields.removeById("number1211288500")

  // remove field
  collection.fields.removeById("select2371146282")

  return app.save(collection)
})
