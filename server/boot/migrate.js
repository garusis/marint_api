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

  const loadSeedData = function (Model) {
    const seederBasePath = './seeds';
    return require(`${seederBasePath}/${Model.definition.name}`);
  };
  const seedModel = function (Model, data) {
    let dataToSeed = data || loadSeedData(Model);
    return new Promise(function (resolve, reject) {
      Model.create(dataToSeed, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  };

  memoryDataSource.automigrate(['Gender', 'AccessToken', 'ACL'], function (err) {

    const Gender = memoryDataSource.models.Gender;
    seedModel(Gender);

    const mongodbDataSource = app.dataSources.mongodb;


        mongodbDataSource.automigrate(['RoleMapping', 'Role', 'AppUser', 'Comment', 'Instructor', 'Publication', 'PublicPublication', 'Student', 'Testimony', 'Course'], (err)=> {
      mongodbDataSource.autoupdate(['RoleMapping', 'Role', 'AppUser', 'Comment', 'Instructor', 'Publication', 'PublicPublication', 'Student', 'Testimony', 'Course'], (err) => {
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
            delete users.garusis;

            roles.instructor.principals.create({
              principalType: RoleMapping.USER,
              principalId: users.marlininternacional.id
            });
            var marlin =users.marlininternacional;
            users.marlininternacional.becomeInstructor();
            users.marlininternacional.save();

            delete users.marlininternacional;

            _.forEach(users, function (user) {
              roles.student.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
              });
              user.becomeStudent();
              user.save();
            });

            seedModel(PublicPublication)
              .then(function () {
                Publication.updateAll({}, {instructorId: marlin.id}, function (err) {
                });
              });

            _.forEach(loadSeedData(Course), function (course) {
              course.instructorId = marlin.id;
              let modules = course.modules;
              delete course.modules;
              Course.create(course, function (err, course) {
                if (err) {
                  return console.log(err);
                }
                _.forEach(modules, function (module) {
                  let videos = module.videos;
                  delete module.videos;
                  course.__create__modules(module, function (err, module) {
                    if (err) {
                      return console.log(err);
                    }
                    _.forEach(videos, function (video) {
                      module.__create__videos(video, function (err) {
                        if (err) {
                          return console.log(err);
                        }
                      });
                    });
                  });
                });
              });
            });
          })
        .catch(function(err){
            console.error(err);

        });
        seedModel(Testimony);
      });
    });
  });
})();
