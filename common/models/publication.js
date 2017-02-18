'use strict';
import ModelBuilder from "loopback-build-model-helper";
import * as commonOp from "../../server/helpers/common-operations"

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

  Publication.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithPolymorphicOwner(arguments)
    let publication = await oldCreate.call(this, data, options)
    return publication
  }

  function Publication() {

  }

};
