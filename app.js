const http = require("http");
const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const WebSocket = require("ws");

var sess;

const server = http.createServer(app);
app.use('/', express.static(__dirname));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});
app.get("/noughtsandcrosses", function(req, res) {
    sess = req.session;
    res.sendFile(path.join(__dirname, "/views/noughtsandcrosses.html"));
});

server.listen(8080);

const websocketServer = new WebSocket.Server({
    server
});

var sockets = [];
websocketServer.on("connection", function(socket) {
    if(!sockets.includes(socket)) {
        sockets.push(socket);
    }

    sockets.forEach(function(s) {
        if(s == socket) {
            var messageObj = {
                "type": "connectedMessage",
                "data": "Welcome to the chat! " + sockets.length.toString() + " user(s) currently online."
            };
            s.send(JSON.stringify(messageObj));
        }
    });

    socket.on("message", function(msg) {
        var msgObj = JSON.parse(msg);
        sockets.forEach(function(s) {
          s.send(JSON.stringify(msgObj));
        });
      });

    socket.on("close", function() {
        var removeIndex = sockets.indexOf(socket);
        sockets.splice(removeIndex, 1); 
    });
});