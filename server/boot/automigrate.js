/**
 * Created by Marcos J. Alvarez on 03/01/2016.
 * @author Marcos J. Alvarez
 * @email garusis@gmail.com
 * @version 0.0.1
 */
var app = require("../server"), _ = require("lodash");

var arangodbDataSource = app.dataSources.arangodb;
arangodbDataSource.automigrate(function () {
});
/*
var MySQLDS = app.dataSources.mysql;
MySQLDS.buildRelations = function (model, cb) {
  if (model.dataSource && model.dataSource.name == MySQLDS.name && model.definition.settings && model.definition.settings.relations) {
    _.forEach(model.definition.settings.relations, function (relation) {
      if (relation.type === "belongsTo") {
        var modelName = model.modelName.toLowerCase(), relationModel = relation.model.toLowerCase();
        var sql = "ALTER TABLE `" + modelName + "`" +
          " ADD CONSTRAINT `" + modelName + "_" + relationModel + "_fk` FOREIGN KEY (`" + (relation.foreignKey || (_.camelCase(relation.model) + "Id")) + "`)" +
          " REFERENCES `" + MySQLDS.connector.settings.database + "`.`" + relationModel + "`(`id`)" +
          " ON DELETE RESTRICT ON UPDATE RESTRICT;";
        MySQLDS.connector.execute(sql, function (err) {
          console.log(err);
        });
      }
    });
  }
};

MySQLDS.automigrate(function () {
  _.forEach(MySQLDS.models, MySQLDS.buildRelations.bind(MySQLDS))
});
*/
