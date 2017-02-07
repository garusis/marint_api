"use strict"
import _ from "lodash"
import dh from "debug-helper"
import app from "../server"
import ModelBuilder from "loopback-build-model-helper"
import PushNotifications from "node-pushnotifications"


module.exports = function (_Push) {
  const pn = new PushNotifications(app.get("push"))
  const builder = new ModelBuilder(Push, _Push)

  let AccessTokenAccount

  builder.build()
    .then(function () {
      AccessTokenAccount = app.models.AccessTokenAccount
    })

  Push.send = async function (userTarget, notification) {
    let registrationIds
    if (_.isString(userTarget)) {
      registrationIds = [userTarget]
    } else {
      registrationIds = await AccessTokenAccount.find({
        where: {userId: userTarget.id, registrationId: {neq: ""}},
        fields: {registrationId: true}
      })
      registrationIds = _.map(registrationIds, "registrationId")
    }
    return await pn.send(registrationIds, notification)
  }
  builder.remoteMethod("send", {
    http: {
      path: "/send-notification",
      verb: "post"
    },
    accepts: [
      {arg: "registrationId", type: "string"},
      {arg: "notification", type: "object"}
    ],
    returns: {type: "object", root: true}
  })

  function Push() {
  }

}
