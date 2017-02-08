"use strict"
import _ from "lodash"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_AppConstant) {
  let builder = new ModelBuilder(AppConstant, _AppConstant)

  let hasChanges = true
  let constants = null

  builder.build()
    .then(function () {
      _AppConstant.observe("persist", function (ctx, next) {
        hasChanges = true
        next()
      })

      _AppConstant.observe("after delete", function (ctx, next) {
        hasChanges = true
        next()
      })
    })

  AppConstant.load = async function () {
    if (!hasChanges) return

    constants = await _AppConstant.find({})
    constants = _.keyBy(constants, "name")
    hasChanges = false
  }

  AppConstant.getPublic = async function () {
    return await _AppConstant.find({where: {isPublic: true}})
  }
  builder.remoteMethod("getPublic", {
    http: {
      verb: "get"
    },
    accepts: [],
    returns: {root: true, type: "array"}
  })


  /**
   *
   * @param {String} name
   */
  AppConstant.findConstant = async function (name) {
    await AppConstant.load()
    return constants[name].value
  }


  function AppConstant() {
  }
}
