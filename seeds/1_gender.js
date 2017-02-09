"use strict"
/**
 * Created by garusis on 06/02/17.
 */
import _ from "lodash"
import Promise from "bluebird"

const genders = [
  {"id": 1, "label": "Female", "slug": "f"},
  {"id": 2, "label": "Male", "slug": "m"}
]


module.exports = async function (app) {
  let Gender = app.models.Gender

  let promises = _.map(genders, (gender) => Gender.create(gender))

  await Promise.all(promises)
}
