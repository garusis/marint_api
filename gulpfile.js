"use strict"
/**
 * Created by garusis on 26/01/17.
 */

require("babel-core/register")
require("babel-polyfill")


const babel = require("gulp-babel")
const del = require("del")
const gulp = require("gulp")
const runSequence = require("run-sequence")
const sourcemaps = require("gulp-sourcemaps")
const config = require("config")
const merge = require("merge-stream")
const nodemon = require("gulp-nodemon")
const _ = require("lodash")

const info = require("./package.json")
const globs = {
  commonIgnored: [
    "!./vendor/**/*", "!./node_modules/**/*",           //  Ignore libs like vendors and node_modules,
    "!./dist/**/*",                                     //  files at dist,
    "!./*"                                              //  and files on project root
  ]
}

globs.copy = _.concat([
  "./**/*",                                           //  Copy all inside root folders, less
  "!./**/*.js"                                        //  .js files that will be compiled
], globs.commonIgnored)                                 //  and common ignored files

globs.compile = _.concat([
  "./**/*.js"                                         //  Compile all .js files
], globs.commonIgnored)                                 //  less common ignored files

globs.watch = ["./server", "./common"]


runSequence.use(gulp)

gulp.task("clean", (cb) => del(["./dist"], cb))

gulp.task("compile", function () {
  return gulp.src(globs.compile)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write(".", {sourceRoot: "./"}))
    .pipe(gulp.dest("dist/"))
})

gulp.task("copy", function () {
  return merge([
    gulp.src(globs.copy).pipe(gulp.dest("dist/"))
  ])
})

gulp.task("build", function (callback) {
  runSequence(
    "clean",
    ["compile", "copy"],
    callback
  )
})


gulp.task("run", ["build"], function (callback) {
  nodemon({
    script: info.main,
    env: process.env,
    watch: globs.watch,
    tasks: ["build"]
  })
})

gulp.task("default", ["build"])
gulp.task("heroku:development", ["build"])
