"use strict";
/**
 * Created by Marcos J. Alvarez on 09/01/2016.
 * @author Marcos J. Alvarez
 * @email garusis@gmail.com
 * @version 0.0.1
 */
module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('createdAt', {type: Date, default: '$now'});
  Model.defineProperty('modifiedAt', {type: Date, default: '$now'});
};
