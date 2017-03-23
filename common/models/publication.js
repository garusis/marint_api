'use strict';
import ModelBuilder from "loopback-build-model-helper";
import * as commonOp from "../../server/helpers/common-operations"

module.exports = function (_Publication) {
  const builder = new ModelBuilder(Publication, _Publication)

  builder.build().then(function () {

    _Publication.belongsTo("instructor", {
      polymorphic: {
        "foreignKey": "userId",
        "discriminator": "account_type"
      },
      options: {
        "defineOwner": true
      }
    })

    _Publication.afterRemote("prototype.__get__comments", function (context, comments, next) {
      context.result = comments.map(function (comment) {
        if (comment.__data.author) {
          comment = comment.toJSON();
          comment.authorImage = comment.author.image;
          delete comment.author
        }
        return comment;
      });
      next(null);
    })

  })

  Publication.createOptionsFromRemotingContext = function (ctx) {
    let base = this.base.createOptionsFromRemotingContext(ctx)
    base.remoteIp = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress
    return base
  };

  Publication.create = async function () {
    let {data, options, oldCreate} = await commonOp.normalizeCreateWithOwner(arguments, true)
    let publication = await oldCreate.call(this, data, options)
    return publication
  }

  function Publication () {

  }

};
