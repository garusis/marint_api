"use strict"
import ModelBuilder from "loopback-build-model-helper"
import loopback from "loopback"
import path from "path"
import dh from "debug-helper"
import app from "../../server/server"
import * as commonOp from "../../server/helpers/common-operations"

module.exports = function (_Contact) {

  const builder = new ModelBuilder(Contact, _Contact)
  const CONTACT_TEMPLATE_CLIENT = path.resolve(__dirname, '../../server/views/contact_us_client.ejs')
  const CONTACT_TEMPLATE_ADMIN = path.resolve(__dirname, '../../server/views/contact_us_admin.ejs')

  builder.build().then(function () {


    _Contact.observe('after save', async function (ctx, next) {
      const Mailer = app.models.Mailer
      if (ctx.isNewInstance) {
        let contactRequest = ctx.instance

        let templateClient = loopback.template(CONTACT_TEMPLATE_CLIENT), templateAdmin = loopback.template(CONTACT_TEMPLATE_ADMIN);

        let optionsClient = {
          from: process.env.FROM_CONTACT_EMAIL,
          to: contactRequest.to,
          subject: 'Gracias por contactarnos.',
          data: contactRequest
        };
        optionsClient.html = templateClient(optionsClient)

        let optionsAdmin = {
          from: process.env.FROM_CONTACT_EMAIL,
          to: process.env.FROM_CONTACT_EMAIL,
          subject: 'Nos han contactado: '+contactRequest.subject,
          data: contactRequest
        };
        optionsAdmin.html = templateAdmin(optionsAdmin)

        Mailer.send(optionsClient, (err) => {if (err) dh.debug.error(err)})
        Mailer.send(optionsAdmin, (err) => {if (err) dh.debug.error(err)})
      }
      next()
    })

  })


  Contact.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithOwner(arguments)
    let token =options.accessToken;

    if (token) {
      let Account = app.models[token.account_type]
      let account = await Account.findById(token.userId)
      data.toName = `${account.name} ${account.surname}`
      data.to = account.email
    }

    let contact = await oldCreate.call(this, data, options)
    return contact
  }

  function Contact () {}
};
