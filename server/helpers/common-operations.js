"use strict";
/**
 * Created by garusis on 13/02/17.
 */
import _ from "lodash"
import dh from "debug-helper"

/**
 *
 * @param args
 * @return {Promise.<{data: *, options: *, oldCreate: *}>}
 */
export async function normalizeCreateArguments (args) {
  let [data, options, oldCreate] = args
  if (_.isUndefined(oldCreate)) {
    if (_.isFunction(options)) {
      oldCreate = options
      options = {}
    } else if (_.isFunction(data)) {
      oldCreate = data
      data = {}
    }
  }
  data = data || {}
  options = options || {}

  return {data, options, oldCreate}
}

/**
 *
 * @param args
 * @param {boolean} [isPolymorphic] default: false
 * @param {object} [ownerOptions] default: {foreignKey: "userId", discriminator: "account_type"}
 * @return {Promise.<{data: Promise.data, options: Promise.options, oldCreate: Promise.oldCreate}>}
 */
export async function normalizeCreateWithOwner(args, isPolymorphic, ownerOptions) {
  let {data, options, oldCreate} = await normalizeCreateArguments(args)

  if(_.isObject(isPolymorphic)){
    ownerOptions = isPolymorphic
    isPolymorphic = false
  }
  isPolymorphic = isPolymorphic || false

  let {foreignKey, discriminator} = ownerOptions || {foreignKey: "userId", discriminator: "account_type"}

  let accessToken = options.accessToken
  if (accessToken) {
    if(isPolymorphic){
      data[discriminator] = accessToken.account_type
    }
    data[foreignKey] = accessToken.userId
  } else {
    dh.debug.info("Creating Owner without an accessToken")
  }

  return {data, options, oldCreate}
}

export function instanceOf(instance, base) {
  return instance && (instance === base || instance.prototype instanceof base)
}
