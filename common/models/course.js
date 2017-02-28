'use strict';
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_Course) {
  let builder = new ModelBuilder(Course, _Course)

  builder.build().then(function () {
    _Course.nestRemoting("modules")
  })

  function Course () {

  }
};
