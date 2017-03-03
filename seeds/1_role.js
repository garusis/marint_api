"use strict"
/**
 * Created by garusis on 06/02/17.
 */
import _ from "lodash"
import Promise from "bluebird"

const roles = [
  {"name": "admin"},
  {"name": "student"},
  {"name": "instructor"},
  {"name": "cron_executer"}
]


module.exports = async function (app) {
  let Role = app.models.Role

  let promises = _.map(roles, (rol) => Role.create(rol))
  await Promise.all(promises)
}
