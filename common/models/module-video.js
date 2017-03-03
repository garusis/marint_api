'use strict';
import ModelBuilder from "loopback-build-model-helper"
import * as commonOp from "../../server/helpers/common-operations"

module.exports = function (_ModuleVideo) {

  const builder = new ModelBuilder(ModuleVideo, _ModuleVideo)

  //TODO: attach id on create by remoteMethod

  builder.build().then(function () {

  })

  ModuleVideo.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithOwner(arguments, {foreignKey: "instructor_id"})
    let video = await oldCreate.call(this, data, options)
    return video
  }

  function ModuleVideo () {
  }

}
