'use strict';
import ModelBuilder from "loopback-build-model-helper"
import * as commonOp from "../../server/helpers/common-operations"

module.exports = function (_ModuleVideo) {

  const builder = new ModelBuilder(ModuleVideo, _ModuleVideo)

  //TODO: attach id on create by remoteMethod

  builder.build().then(function () {
    let models = app.models
    let Role = models.Role
    let Student = models.Student
    let ModuleStudent = models.ModuleStudent

    Role.registerResolver('$video_viewer', function (role, context, cb) {
      let token = context.accessToken;
      let AccountModel = models[token.account_type]

      if (!token || token.id === "$anonymous" || !context.modelId || !commonOp.instanceOf(AccountModel, Student)) {
        return process.nextTick(() => cb(null, false));
      }

      _ModuleVideo.findOne({where: {id: context.modelId}})
        .then(function (video) {
          if (!video) return cb(null, false)

          return ModuleStudent
            .findOne({where: {module_id: video.module_id, student_id: token.userId}})
            .then(function (resource) {
              return cb(null, !!resource);
            })
        })
        .catch(cb)
    })
  })

  ModuleVideo.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithOwner(arguments, {foreignKey: "instructor_id"})
    let video = await oldCreate.call(this, data, options)
    return video
  }

  function ModuleVideo () {
  }

}
