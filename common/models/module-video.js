'use strict';
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_ModuleVideo) {

  const builder = new ModelBuilder(ModuleVideo, _ModuleVideo)

  builder.build().then(function () {

  })


  function ModuleVideo() {
  }

}
