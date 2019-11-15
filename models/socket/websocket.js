const WebSocket = require('websocket').server;
const createWebSocketServer = server => {
  const wsServer = new WebSocket({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });

  //此方法是设置允许连接本 websocket的ip或者域名
  function originIsAllowed(origin) {
    console.log(origin);
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    const connection = request.accept('echo-protocol', request.origin);
    console.log(new Date() + ' Connection accepted.');
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      }
    });
    connection.on('close', function(reasonCode, description) {
      console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
};

module.exports = createWebSocketServer;
