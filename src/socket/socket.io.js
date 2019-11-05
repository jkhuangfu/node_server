const socket = require('socket.io');
const createSocketIoServer = function(server) {
  const io = socket(server);
  io.on('connection', function(Socket) {
    console.log('scoket连接成功');
    // 监听客户事件
    Socket.on('watchClient', function(req) {
      // 同页面信息传递
      Socket.emit('send', { data: req });
      // 跨页面全局信息传递
      Socket.broadcast.emit('send', { data: req });
    });
  });
};
module.exports = createSocketIoServer;
