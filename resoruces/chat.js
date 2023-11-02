// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// const port = 6969;
// const server = http.createServer(express);
// const wss = new WebSocket.Server({ server })

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(data) {
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     })
//   })
// })

// server.listen(port, function() {
//   console.log(`Server is listening on ${port}!`)
// })
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

// Create an array to track connected clients
const clients = new Set();

wss.on('connection', function connection(ws) {
  // Add the new client to the tracking list
  clients.add(ws);

  // Notify all clients about the new connection
  clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send('A new user has connected.');
    }
  });

  // Handle incoming messages
  ws.on('message', function incoming(data) {
    // Broadcast the message to all clients
    clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // Handle disconnection
  ws.on('close', function() {
    // Remove the disconnected client from the tracking list
    clients.delete(ws);

    // Notify all clients about the disconnection
    clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send('A user has disconnected.');
      }
    });
  });
});

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`);
});
