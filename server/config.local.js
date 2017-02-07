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
