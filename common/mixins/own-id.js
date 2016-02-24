"use strict";
/**
 * Created by Marcos J. Alvarez on 09/01/2016.
 * @author Marcos J. Alvarez
 * @email garusis@gmail.com
 * @version 0.0.1
 */
const _ = require("lodash");
const Base64 = {
  _Rixits: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
  fromNumber: function (number) {
    var rixit; // like 'digit', only in some non-decimal radix
    var residual = Math.floor(number);
    var result = '';
    while (true) {
      rixit = residual % 62;
      // console.log("rixit : " + rixit);
      // console.log("result before : " + result);
      result = this._Rixits[rixit] + result;
      // console.log("result after : " + result);
      // console.log("residual before : " + residual);
      residual = Math.floor(residual / 64);
      // console.log("residual after : " + residual);
      if (residual == 0)
        break;
    }
    return result;
  },

  toNumber: function (rixits) {
    var result = 0;
    // console.log("rixits : " + rixits);
    // console.log("rixits.split('') : " + rixits.split(''));
    rixits = rixits.split('');
    for (let e in rixits) {
      // console.log("_Rixits.indexOf(" + rixits[e] + ") : " +
      // this._Rixits.indexOf(rixits[e]));
      // console.log("result before : " + result);
      result = (result * 64) + this._Rixits.indexOf(rixits[e]);
      // console.log("result after : " + result);
    }
    return result;
  }
};

const __def = {};

let counter = 0;
module.exports = function (Model, options) {
  options = _.defaults(options || {}, __def);

  Model.observe("before save", function (ctx, next) {
    let t = this;
    if (ctx.isNewInstance) {
      counter = counter > 10000 ? 0 : ++counter;
      ctx.instance.id = Base64.fromNumber(Date.now()) + Base64.fromNumber(counter);
    }
    next();
  });
  // Model is the model class
  // options is an object containing the config properties from model definition
  //Model.defineProperty('id', {type: String, index: {unique: true}, id: true});
};
