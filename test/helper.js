/**
 * Created by garusis on 04/12/16.
 */
import {should, assert, expect} from 'chai'
import _ from 'lodash'
import Promise from 'bluebird'
import moment from 'moment'
import request from 'supertest'
import app from  '../server/server'

global.should = should
global.expect = expect
global.assert = assert
global.BPromise = Promise
global.request = request
global.moment = moment
global.app = app
global._ = _

global.agent = request.agent(app)

global.MathUtils = {
  randomNumber: function (max, min) {
    min = min || 0
    max = max || 10
    return min + Math.floor(Math.random() * (max - min + 1))
  }
}

app.on("booted", function () {
  run()
})
