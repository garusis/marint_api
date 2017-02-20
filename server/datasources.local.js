import _ from "lodash"

let datasources = {
  "memory": {
    "name": "memory",
    "connector": "memory"
  }
}

function setDB(dbName, dbPrefix) {
  datasources[dbName] = {
    "host": process.env[`${dbPrefix}_HOST`],
    "database": process.env[`${dbPrefix}_NAME`],
    "username": process.env[`${dbPrefix}_USERNAME`],
    "password": process.env[`${dbPrefix}_PASSWORD`],
    "max": Number(process.env[`${dbPrefix}_POOL_MAX`]) || 10,
    "name": dbName,
    "connector": dbName
  }
}

if (process.env.PG_HOST) {
  setDB("postgresql","PG")
}

if (process.env.MY_SQL_HOST) {
  setDB("mysql","MY_SQL")
}

if (process.env.MONGO_HOST) {
  setDB("mongodb","MONGO")
}

if (process.env.USE_FILESYSTEM) {
  datasources.filesystem = {
    "name": "filesystem",
    "connector": "loopback-component-storage",
    "provider": "filesystem",
    "root": process.env.PATH_FILES || path.join(process.cwd(), "storage"),
    "getFilename": function (origFilename) {
      origFilename = origFilename.name
      let parts = origFilename.split('.')
      let extension = parts[parts.length - 1]
      return Date.now() + '_' + parts[parts.length - 2] + '.' + extension
    }
  }
}

if (process.env.CLOUD_STORAGE_PROVIDER) {
  datasources.cloudstorage = {
    "name": "cloudstorage",
    "connector": "loopback-component-storage",
    "provider": process.env.CLOUD_STORAGE_PROVIDER
  }
  let credentials = JSON.parse(process.env.CLOUD_STORAGE_CREDENTIALS)
  _.assign(datasources, credentials)
}
module.exports = datasources
