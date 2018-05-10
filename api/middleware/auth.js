/*
  In reality, this function would deconstruct a bearer token and check claims.
  For this prototype, we will use the auth header to carry the user_id, and
  set the context state in our Koa router accordingly, exposing it.
*/

const VALID_USER_ID = require('../domain/example_message_history')[0].sender_id;
const { NO_AUTH, INVALID_AUTH } = require('../error/error');

const authorize = (ctx, next) => {
  if (!ctx.request.headers['authorization']) {
    return ctx.throw(401, NO_AUTH);
  }

  if (ctx.request.headers['authorization'] !== VALID_USER_ID) {
    return ctx.throw(401, INVALID_AUTH);
  }

  ctx.state.userId = VALID_USER_ID;
  return next();
};

module.exports = authorize;
