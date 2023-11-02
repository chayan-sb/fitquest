const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

let loggedInUser="chayan";
// let userCounter = 1;

// wss.on('connection', function connection(ws) {
//   ws.user = `${loggedInUser}`;

//   ws.on('message', function incoming(data) {
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(`${ws.user}: ${data}`);
//       }
//     });
//   });
// });
wss.on('connection', function connection(ws) {
  ws.user = loggedInUser; // Set the user property for this connection

  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${ws.user}: ${data}`);
      }
    });
  });
});


server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
