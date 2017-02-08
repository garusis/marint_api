"use strict"
/**
 * Created by garusis on 06/02/17.
 */

const genders = [
  {"id": 1, "label": "Female", "slug": "f"},
  {"id": 2, "label": "Male", "slug": "m"}
]


module.exports = async function (app) {
  let Gender = app.models.Gender

  await Gender.create(genders)
}
