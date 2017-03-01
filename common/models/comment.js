"use strict";
import ModelBuilder from "loopback-build-model-helper"
import request from "request-promise"
import * as commonOp from "../../server/helpers/common-operations"
import app from "../../server/server"

module.exports = function (_Comment) {

  const builder = new ModelBuilder(Comment, _Comment)

  builder.build().then(function () {

    _Comment.belongsTo("author", {
      polymorphic: {
        "foreignKey": "userId",
        "discriminator": "account_type"
      }
    })

    _Comment.belongsTo("publication", {
      polymorphic: {
        "foreignKey": "publication_id",
        "discriminator": "publication_type"
      }
    })

  })

  Comment.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithPolymorphicOwner(arguments)

    if (data.userId) {
      let Account = app.models[data.account_type]
      let account = await Account.findById(data.userId)
      data.publisherName = `${account.name} ${account.surname}`
    } else {
      let err = new Error()
      err.statusCode = 401
      err.message = "Invalid Captcha"

      let recaptchaResponse = data.gRecaptchaResponse
      delete data.gRecaptchaResponse
      if(!recaptchaResponse){
        throw err
      }

      let response = await request.post(process.env.RECAPTCHA_VERIFY_URL, {
        json: true,
        body: {
          secret:process.env.RECAPTCHA_SECRET,
          response: recaptchaResponse,
          remoteip: options.remoteIp
        }
      })

      if(!response.success){
        throw err
      }
    }

    let comment = await oldCreate.call(this, data, options)
    return comment
  }

  function Comment () {
  }

};
