"use strict"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function(_Image) {

  const builder = new ModelBuilder(Image, _Image)

  builder.build().then(function () {
    _Image.belongsTo("imageable", {
      polymorphic: {
        "foreignKey": "imageable_id",
        "discriminator": "imageable_type"
      }
    })
  })

  function Image() {
  }

};
