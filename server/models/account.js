'use strict'
import ModelBuilder from "loopback-build-model-helper"
import dh from "debug-helper"
import app from "../server"
import _ from "lodash"

module.exports = function (_Account) {

  //TODO: Update all of its comments to update publisherName

  const builder = new ModelBuilder(Account, _Account)

  app.on("started", function () {
    setTimeout(() => dh.debug.info(_.omit(app.models.ModuleVideo.relations.uploader, ["modelFrom", "modelTo"])), 2000)
    setTimeout(() => dh.debug.info(_.omit(app.models.ModuleVideo.relations.comments, ["modelFrom", "modelTo"])), 2000)
  })

  builder.build().then(function () {
    let Role = app.models.Role

    Role.registerResolver('$uploader', function (role, context, cb) {
      let token = context.accessToken;
      if (!token) {
        return process.nextTick(() => cb(null, false));
      }

      let Model = context.model
      let uploaderRelation = Model.relations.uploader || _.find(Model.relations, (relation) => relation.options.defineUploader)
      if (!uploaderRelation) {
        return process.nextTick(() => cb(new Error(`${Model.definition.name} has not an uploader relation`)));
      }

      context.model.findOne({where: {id: context.modelId}}, function (err, resource) {
        if (err) return cb(err);
        if (!resource) return cb(new Error("Resource not found"));

        // Step 2: check if User is part of the Team associated with this Project
        // (using count() because we only want to know if such a record exists)
        var Team = app.models.Team;
        Team.count({
          ownerId: resource.ownerId,
          memberId: userId
        }, function (err, count) {
          // A: The datastore produced an error! Pass error to callback
          if (err) return cb(err);

          if (count > 0) {
            // A: YES. At least one Team associated with this User AND Project
            // callback with TRUE, user is role:`teamMember`
            return cb(null, true);
          }

          else {
            // A: NO, User is not in this Project's Team
            // callback with FALSE, user is NOT role:`teamMember`
            return cb(null, false);
          }
        })
      })
    })


  })

  function Account() {
  }

}
