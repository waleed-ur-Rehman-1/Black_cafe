const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const initSockets = require('./sockets');
require('./jobs/reconcilePayments');

async function bootstrap() {
  await connectDB();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: env.corsOrigins.length ? env.corsOrigins : true, credentials: true },
  });
  initSockets(io);
  app.set('io', io);

  server.listen(env.port, () => {
    console.log(`🚀 Black Cafe API on :${env.port} [${env.nodeEnv}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error', err);
  process.exit(1);
});