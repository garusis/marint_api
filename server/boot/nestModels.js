"use strict";
/**
 * Created by Laptocito on 31/01/2016.
 */
module.exports = function (app) {
  app.models.Course.nestRemoting('modules');
};
