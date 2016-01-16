"use strict";
/**
 * Created by Marcos J. Alvarez on 03/01/2016.
 * @author Marcos J. Alvarez
 * @email garusis@gmail.com
 * @version 0.0.1
 */
(() => {
  const app = require("../server");
  const _ = require("lodash");
  const async = require("async");

  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  const memoryDataSource = app.dataSources.memory;

  memoryDataSource.automigrate(["Gender", "AccessToken", "ACL"], (err) => {
    const Gender = memoryDataSource.models.Gender;

    Gender.create([{
      name: "Masculino",
      short: "m"
    }, {
      name: "Femenino",
      short: "f"
    }], (err) => {

    });

    const mongodbDataSource = app.dataSources.mongodb;

    mongodbDataSource.automigrate(["RoleMapping", "Role", "AppUser", "Comment", "Instructor", "Publication", "PublicPublication", "Student", "Testimony"], (err)=> {
      mongodbDataSource.autoupdate(["RoleMapping", "Role", "AppUser", "Comment", "Instructor", "Publication", "PublicPublication", "Student", "Testimony"], (err) => {
        const User = mongodbDataSource.models.AppUser;

        Role.create([
          {name: "admin"},
          {name: "instructor"},
          {name: "student"},
          {name: "suscriptor"}
        ], (err, roles) => {
          roles = _.indexBy(roles, "name");

          User.create([
            {
              "name": "Marcos J.",
              "lastname": "Alvarez M.",
              "username": "garusis",
              "email": "garusis@gmail.com",
              "emailVerified": true,
              "password": "123456",
              "created": "2016-01-10",
              "lastUpdated": "2016-01-10",
              "lastAccess": "2016-01-10",
              "genderShort": "m"
            },
            {
              "name": "Marco Lino",
              "lastname": " Alvarez B.",
              "username": "marlininternacional",
              "email": "marlininternacional@hotmail.com",
              "emailVerified": true,
              "password": "123456",
              "created": "2016-01-10",
              "lastUpdated": "2016-01-10",
              "lastAccess": "2016-01-10",
              "genderShort": "m"
            },
            {
              "name": "Yanidis Josefina",
              "lastname": "Maestre D.",
              "username": "yanidisjos",
              "email": "yanidisjos@gmail.com",
              "emailVerified": true,
              "password": "123456",
              "created": "2016-01-10",
              "lastUpdated": "2016-01-10",
              "lastAccess": "2016-01-10",
              "genderShort": "f"
            }
          ], (err, users) => {
            users = _.indexBy(users, "username");

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

            User.login({username: users.garusis.username, password: "123456"}, (err, token) => {
              console.log(token);
            });
          });
        });
      });
    });
  });
})();
