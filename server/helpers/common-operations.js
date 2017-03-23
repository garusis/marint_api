"use strict";
/**
 * Created by garusis on 13/02/17.
 */
import _ from "lodash"
import dh from "debug-helper"

/**
 *
 * @param args
 * @param {boolean} [isPolymorphic] default: false
 * @param {object} [ownerOptions] default: {foreignKey: "userId", discriminator: "account_type"}
 * @return {Promise.<{data: Promise.data, options: Promise.options, oldCreate: Promise.oldCreate}>}
 */
export async function normalizeCreateWithOwner (args, isPolymorphic, ownerOptions) {
  let [data, options, oldCreate] = await normalizeArgsObjOptionsFunction(args)

  if (_.isObject(isPolymorphic)) {
    ownerOptions = isPolymorphic
    isPolymorphic = false
  }
  isPolymorphic = isPolymorphic || false

  let {foreignKey, discriminator} = ownerOptions || {foreignKey: "userId", discriminator: "account_type"}

  let accessToken = options.accessToken
  if (accessToken) {
    if (isPolymorphic) {
      data[discriminator] = accessToken.account_type
    }
    data[foreignKey] = accessToken.userId
  } else {
    dh.debug.info("Creating Owner without an accessToken")
  }

  return {data, options, oldCreate}
}

export async function normalizeArgsObjOptionsFunction (args) {
  let [obj, options, fn] = args
  if (_.isUndefined(fn)) {
    if (_.isFunction(options)) {
      fn = options
      options = {}
    } else if (_.isFunction(obj)) {
      fn = obj
      obj = {}
    }
  }
  obj = obj || {}
  options = options || {}

  return [obj, options, fn]
}

export async function normalizeFindWithInclude (args) {
  let [filter, options, oldFind] = await normalizeArgsObjOptionsFunction(args)

  if (!filter.include) {
    filter.include = []
  }

  if(!_.isArray(filter.include)){
    filter.include = [filter.include]
  }

  return {filter, options, oldFind}
}

export function instanceOf (instance, base) {
  return instance && (instance === base || instance.prototype instanceof base)
}
