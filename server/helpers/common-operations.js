"use strict";
/**
 * Created by garusis on 13/02/17.
 */
import _ from "lodash"
import dh from "debug-helper"

/**
 *
 * @param {Array|Arguments} args
 * @param {Object} [ownerOptions]
 * @return {Promise.<{data: *, options: *, oldCreate: *}>}
 */
export async function normalizeCreateWithPolymorphicOwner(args, ownerOptions) {
  let [data, options, oldCreate] = args
  let {foreignKey, discriminator} = ownerOptions || {foreignKey: "userId", discriminator: "account_type"}

  if (_.isUndefined(oldCreate)) {
    if (_.isFunction(options)) {
      oldCreate = options;
      options = {};
    } else if (_.isFunction(data)) {
      oldCreate = data;
      data = {};
    }
  }
  data = data || {};
  options = options || {};

  let accessToken = options.accessToken
  if (accessToken) {
    data[foreignKey] = accessToken.userId
    data[discriminator] = accessToken.account_type
  } else {
    dh.debug.info("Creating polymorphic Owner without an accessToken")
  }

  return {data, options, oldCreate}
}

export function instanceOf(instance, base) {
  return instance && (instance === base || instance.prototype instanceof base)
}
