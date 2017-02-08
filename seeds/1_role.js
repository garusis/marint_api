"use strict"
/**
 * Created by garusis on 06/02/17.
 */

const roles = [
  {"name": "admin"},
  {"name": "app_user"},
  {"name": "cron_executer"}
]


module.exports = async function (app) {
  let Role = app.models.Role

  await Role.create(roles)
}
