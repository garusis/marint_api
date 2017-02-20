"use strict"

import _ from "lodash"
import dh from "debug-helper"
import Promise from "bluebird"
import ModelBuilder from "loopback-build-model-helper"

module.exports = function (_BashHelper) {

  let builder = new ModelBuilder(BashHelper, _BashHelper)

  let defaultBatchSize = 50

  builder.build()
    .then(function () {
    })


  /**
   * Exec eachCb for each item that match with filter in batch. This method call to Model.find method without skip filter
   * for get each batch so only use it when filter.where have conditions that validates that items in a batch don"t
   * collide with items in another batch.
   * @param Model
   * @param where
   * @param [options]
   * @param [batchSize]
   * @param eachCb
   */
  BashHelper.applyToNoRepetibleList = async function (Model, where, options, batchSize, eachCb) {
    if(_.isFunction(options)){
      eachCb = options
      options = null
      batchSize = null
    }

    if(_.isFunction(batchSize)){
      eachCb = batchSize
      batchSize = null
    }

    let filter = {
      limit: batchSize || defaultBatchSize,
      where
    }

    let batch
    while ((batch = await Model.find(filter, options)).length > 0) {
      await execOnBatch(batch, eachCb)
    }
  }

  /**
   * Exec eachCb for each item that match with filter in batch. This method call to Model.find method with skip filter
   * for get each batch so use it when the results size"s list don"t change in each call to Model.find.
   * @param Model
   * @param where
   * @param options
   * @param batchSize
   * @param eachCb
   */
  BashHelper.applyToRepetibleList = async function (Model, where, options, batchSize, eachCb) {
    if(_.isFunction(options)){
      eachCb = options
      options = null
      batchSize = null
    }

    if(_.isFunction(batchSize)){
      eachCb = batchSize
      batchSize = null
    }

    let filter = {
      limit: batchSize || defaultBatchSize,
      where,
      skip: 0
    }

    let batch
    while ((batch = await Model.find(filter, options)).length > 0) {
      filter.skip += filter.limit
      await execOnBatch(batch, eachCb)
    }
  }

  async function execOnBatch(batch, eachCb) {
    if (eachCb.length === 2) {
      eachCb = Promise.promisify(eachCb)
    }

    let promises = _.map(batch, function (item) {
      return eachCb(item).catch((err) => dh.debug.error(err))
    })

    return await Promise.all(promises)
  }

  function BashHelper() {

  }

}
