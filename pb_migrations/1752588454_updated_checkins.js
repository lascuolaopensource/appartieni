/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1322349139",
    "max": null,
    "min": null,
    "name": "reward_points",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702085596")

  // update field
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
})
