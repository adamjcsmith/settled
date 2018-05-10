const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const api = new Koa();
const router = new Router();

const authorize = require('./middleware/auth');
const { getMessageThread, createMessage } = require('./service/messageService');
const { port } = require('./config');

// Allow body parsing and CORS
api
  .use(bodyParser())
  .use(cors());

// Auth middleware
router.use(authorize);

// Endpoint for retrieving all messages.
router.get('/messages/:secondPartyId', async (ctx, next) => {
  try {
    ctx.body = await getMessageThread(ctx.state.userId, ctx.params.secondPartyId);
    return next();
  } catch (e) {
    return ctx.throw(e);
  }
});

// Endpoint for sending a message. We return the new list of messages on success.
router.post('/messages/:secondPartyId', async (ctx, next) => {
  try {
    ctx.body = await createMessage(ctx.state.userId, ctx.params.secondPartyId, ctx.request.body);
    return next();
  } catch (e) {
    return ctx.throw(e);
  }
});

api
  .use(router.routes())
  .use(router.allowedMethods());

api.listen(port);
