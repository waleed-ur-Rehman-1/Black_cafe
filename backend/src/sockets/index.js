const jwt = require('jsonwebtoken');
const env = require('../config/env'); // ✅ fixed: was ../../config/env

function initSockets(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) {
        const payload = jwt.verify(token, env.jwtSecret);
        socket.user = payload;
      }
      next();
    } catch (e) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 socket connected', socket.id, socket.user?.sub || 'guest');

    socket.on('order:subscribe', ({ orderId }) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('branch:subscribe', ({ branchId }) => {
      if (
        socket.user &&
        ['SUPER_ADMIN', 'BRANCH_MANAGER', 'KITCHEN_STAFF'].includes(socket.user.role)
      ) {
        socket.join(`branch:${branchId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 socket disconnected', socket.id);
    });
  });
}

module.exports = initSockets;