'use strict';
import ModelBuilder from "loopback-build-model-helper";
import _ from "lodash"
import app from "../../server/server"

module.exports = function (_Publication) {
  const builder = new ModelBuilder(Publication, _Publication)

  builder.build().then(function () {

    _Publication.belongsTo("instructor", {
      polymorphic: {
        "foreignKey": "account_id",
        "discriminator": "account_type"
      }
    })

  })

  Publication.create = async function (data, options, oldCreate) {
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
    data.account_id = accessToken.account_id
    data.account_type = accessToken.account_type

    let publication = await oldCreate.call(this, data, options)
    return publication
  }

  function Publication() {

  }

};
