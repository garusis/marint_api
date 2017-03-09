"use strict"
import ModelBuilder from "loopback-build-model-helper"
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
      }
      next()
    })


  })

  function Contact () {}
};
