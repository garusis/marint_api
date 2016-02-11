'use strict';
/**
 * Created by Marcos J. Alvarez on 03/01/2016.
 * @author Marcos J. Alvarez
 * @email garusis@gmail.com
 * @version 0.0.1
 */
(() => {
  const app = require('../server');
  const fs = require('fs');
  const _ = require('lodash');
  const async = require('async');
  const Promise = require('bluebird');


  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  const memoryDataSource = app.dataSources.memory;

  const seedModel = function (Model, data) {
    const seederBasePath = './seeds';
    var dataToSeed = data || require(`${seederBasePath}/${Model.definition.name}`);
    return new Promise(function (resolve, reject) {
      Model.create(dataToSeed, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      })
    });
  };

  memoryDataSource.automigrate(['Gender', 'AccessToken', 'ACL'], function (err) {

    const Gender = memoryDataSource.models.Gender;
    seedModel(Gender);

    const mongodbDataSource = app.dataSources.mongodb;

    mongodbDataSource.automigrate(['RoleMapping', 'Role', 'AppUser', 'Comment', 'Instructor', 'Publication', 'PublicPublication', 'Student', 'Testimony'], (err)=> {
      mongodbDataSource.autoupdate(['RoleMapping', 'Role', 'AppUser', 'Comment', 'Instructor', 'Publication', 'PublicPublication', 'Student', 'Testimony'], (err) => {
        const User = mongodbDataSource.models.AppUser;
        const Testimony = mongodbDataSource.models.Testimony;
        const PublicPublication = mongodbDataSource.models.PublicPublication;
        const Publication = mongodbDataSource.models.Publication;
        const Course = mongodbDataSource.models.Course;

        let courses;
        let coursesModules;


        Promise
          .resolve([seedModel(Role), seedModel(User)])
          .spread(function (roles, users) {
            roles = _.indexBy(roles, 'name');
            users = _.indexBy(users, 'username');

            roles.admin.principals.create({
              principalType: RoleMapping.USER,
              principalId: users.garusis.id
            });

            roles.instructor.principals.create({
              principalType: RoleMapping.USER,
              principalId: users.marlininternacional.id
            });

            roles.student.principals.create({
              principalType: RoleMapping.USER,
              principalId: users.yanidisjos.id
            });

            users.marlininternacional.becomeInstructor();
            users.marlininternacional.save();

            User.login({username: users.garusis.username, password: '123456'}, function (err, token) {
              console.log(token);
            });

            seedModel(PublicPublication)
              .then(function () {
                Publication.updateAll({}, {instructorId: users.marlininternacional.id}, function (err) {
                });
              });
            seedModel(Course)
              .then(function (elems) {
                Course.updateAll({}, {instructorId: users.marlininternacional.id}, function (err, resp) {

                });
              });
          });
        seedModel(Testimony);
      });
    });
  });
})();
