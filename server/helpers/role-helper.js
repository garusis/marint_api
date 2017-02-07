"use strict"
import ModelBuilder from "loopback-build-model-helper"
import app from "../server"

module.exports = function (_RoleHelper) {

  let builder = new ModelBuilder(RoleHelper, _RoleHelper)
  let RoleMapping
  let Role

  builder.build().then(function () {
    RoleMapping = app.models.RoleMapping
    Role = app.models.Role
  })

  RoleHelper.assignTo = async function (roleName, principalId) {
    let role = await Role.findOne({where: {name: roleName}})
    await role.principals.create({
      principalType: RoleMapping.USER,
      principalId: principalId
    })
  }


  function RoleHelper() {

  }

}
