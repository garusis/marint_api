"use strict"

import _ from "lodash"
import Promise from "bluebird"

module.exports = function (Validationhelper) {

  Validationhelper.validatesPresenceOf = async function (field, inObject, Model) {
    let modelName = Model.definition.name
    let value = inObject[field]

    if (!_.isNil(value)) return true

    let error = new Error(`The \`${modelName}\` instance is not valid. Details: \`${field}\` can't be blank (value: ${value}).`)

    error.name = "ValidationError"
    error.status = 422
    error.statusCode = 422
    error.details = {
      "context": modelName,
      "codes": {},
      "messages": {}
    }
    error.details.codes[field] = [
      "presence"
    ]
    error.details.messages[field] = [
      "can't be blank"
    ]

    throw error
  }

  Validationhelper.validatesDifference = async function (field, comparator, inObject, Model) {
    let modelName = Model.definition.name
    let value = inObject[field]

    if (_.isFunction(comparator) ? !comparator(value) : value !== comparator) {
      return true
    }

    let error = new Error(`The \`${modelName}\` instance is not valid. Details: \`${field}\` can't be ${value}.`)

    error.name = "ValidationError"
    error.status = 422
    error.statusCode = 422
    error.details = {
      "context": modelName,
      "codes": {},
      "messages": {}
    }
    error.details.codes[field] = [
      "equality"
    ]
    error.details.messages[field] = [
      `can't be ${value}`
    ]

    throw error
  }

}
