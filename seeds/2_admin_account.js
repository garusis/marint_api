"use strict"
/**
 * Created by garusis on 06/02/17.
 */

const admins = [
  {
    "name": "Default",
    "surname": "Admin",
    "email": process.env.DEFAULT_ADMIN_EMAIL,
    "username": process.env.DEFAULT_ADMIN_USERNAME,
    "password": process.env.DEFAULT_ADMIN_PASSWORD
  }
]


module.exports = async function (app) {
  let AdminAccount = app.models.AdminAccount

  await AdminAccount.create(admins)
}
