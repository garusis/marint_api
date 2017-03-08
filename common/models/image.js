"use strict"
import ModelBuilder from "loopback-build-model-helper"
import Jimp from "jimp"
import AWS from "aws-sdk"
import Promise from "bluebird"
import randomstring from "randomstring"
import app from "../../server/server"

module.exports = function (_Image) {

  const S3 = new AWS.S3(app.get("s3").profile_image);
  const builder = new ModelBuilder(Image, _Image)

  builder.build().then(function () {
    _Image.belongsTo("imageable", {
      polymorphic: {
        "foreignKey": "imageable_id",
        "discriminator": "imageable_type"
      }
    })
  })

  Image.resizeAndUploadProfileImage = async function (image, width, height) {
    let sub = "original"
    if (width && height) {
      sub = `${width}x${height}`
      image = image.clone()
      image.resize(width, height)
    }

    let key = `${process.env.S3_UPLOAD_PROFILE_BASE_KEY}/${sub}/${Date.now()}_${randomstring.generate({charset: "hex"})}.png`

    await S3.putObject({
      Body: await Promise.promisify(image.getBuffer, {context: image})(Jimp.MIME_PNG),
      ContentType: Jimp.MIME_PNG,
      Key: key
    }).promise()
    return key
  }

  Image.uploadProfileImage = async function (req) {
    let originalImage = await Jimp.read(req.file.buffer)

    return new _Image(await Promise.props({
      "original": Image.resizeAndUploadProfileImage(originalImage),
      "thumb_small": Image.resizeAndUploadProfileImage(originalImage, 50, 50),
      "thumb_medium": Image.resizeAndUploadProfileImage(originalImage, 70, 70),
      "thumb_large": Image.resizeAndUploadProfileImage(originalImage, 100, 100),
      "thumb_xlarge": Image.resizeAndUploadProfileImage(originalImage, 120, 120),
      "small": Image.resizeAndUploadProfileImage(originalImage, 150, 150),
      "medium": Image.resizeAndUploadProfileImage(originalImage, 300, 300),
      "large": Image.resizeAndUploadProfileImage(originalImage, 400, 400),
      "xlarge": Image.resizeAndUploadProfileImage(originalImage, 700, 700)
    }))
  }
  _Image.remoteMethod('uploadProfileImage', {
    isStatic: true,
    http: {
      verb: "post",
      path: "/profile-image"
    },
    accepts: [
      {arg: 'req', type: 'object', 'http': {source: 'req'}}
    ],
    returns: {type: 'Image', root: true}
  });

  function Image () {
  }
};
