"use strict";
module.exports = function (AppUser) {

  const __proto__ = AppUser.prototype;
  __proto__.becomeInstructor = function () {
    let Instructor = require("../../server/server").models.Instructor;
    this.__model_name__ = Instructor.definition.name;
  };

  __proto__.becomeStudent = function () {
    let Student = require("../../server/server").models.Student;
    this.__model_name__ = Student.definition.name;
  };
};
