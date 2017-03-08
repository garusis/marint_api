"use strict"

import loopback from "loopback"
import boot from "loopback-boot"
import cluster from "cluster"
import control from "strong-cluster-control"
import moment from "moment"
import multer from "multer"
import ModelBuilder from "loopback-build-model-helper"

let app = loopback()
export default app
module.exports = app //to keep compatibility with lb-ng

if (process.env.NODE_ENV === 'production') {
  if (cluster.isWorker) {
    startWorker()
  } else {
    let cpuNumber = Number(process.env.CPUS) || control.CPUS
    control.start({
      size: cpuNumber,
      throttleDelay: 5000
    })
    console.log('CPUs: ', cpuNumber)
  }
} else {
  startWorker()
}

function startWorker () {
  app.start = function () {
    // start the web server
    return app.listen(function () {
      app.emit("started")
      let baseUrl = app.get("url").replace(/\/$/, "")
      console.log(`Web server listening at: ${baseUrl}`)
      if (app.get("loopback-component-explorer")) {
        let explorerPath = app.get("loopback-component-explorer").mountPath
        console.log(`Browse your REST API at ${baseUrl}${explorerPath}`)
      }
    })
  }

  moment.locale("es")
  ModelBuilder.config({app})

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
  boot(app, __dirname, function (err) {
    if (err) throw err

    app.use("parse", loopback.token({
      model: app.models.AccessTokenAccount
    }));

    let uploader = multer({
      storage: multer.memoryStorage(),
      limits: {fileSize: 5000000, files: 1}
    })

    app.post(`${app.get("restApiRoot")}/${app.models.Image.settings.plural}/profile-image`, uploader.single('image'))

    // start the server if `$ node server.js`
    if (require.main === module)
      app.start()
  })
}

