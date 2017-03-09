"use strict"
import ModelBuilder from "loopback-build-model-helper"
import loopback from "loopback"
import path from "path"
import dh from "debug-helper"
import app from "../../server/server"

module.exports = function (_Contact) {

  const builder = new ModelBuilder(Contact, _Contact)
  const CONTACT_TEMPLATE_CLIENT = path.resolve(__dirname, '../../server/views/contact_client.ejs')
  const CONTACT_TEMPLATE_ADMIN = path.resolve(__dirname, '../../server/views/contact_admin.ejs')

  builder.build().then(function () {
    const Mailer = app.models.Mailer

    _Contact.observe('after create', async function (ctx, next) {
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
          subject: 'Nos han contactado',
          data: contactRequest
        };
        optionsAdmin.html = templateAdmin(optionsAdmin)

        Mailer.send(optionsClient, (err) => {if (err) dh.debug.error(err)})
        Mailer.send(optionsAdmin, (err) => {if (err) dh.debug.error(err)})
      }
      next()
    })

  })

  function Contact () {}
};
