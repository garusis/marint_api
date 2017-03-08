import path from "path"

exports.host = "0.0.0.0"
exports.port = process.env.PORT || 3000

exports.push = {
  gcm: {
    id: process.env.PUSH_GCM_API_KEY
  },
  apn: {
    token: {
      key: path.join(process.cwd(), "certs/key.p8"),
      keyId: process.env.APN_KEY_ID,
      teamId: process.env.APN_TEAM_ID
    }
  }
}

exports.s3 = {
  profile_image: {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_UPLOAD_PROFILE_IMAGE_KEYID,
    secretAccessKey: process.env.S3_UPLOAD_PROFILE_IMAGE_SECRET,
    params: {
      Bucket: process.env.S3_BUCKET,
      ACL: "public-read"
    }
  },
  module_video: {
    region: process.env.S3_REGION,
    params: {
      Bucket: process.env.S3_BUCKET,
      ACL: "public-read"
    }
  }
}
