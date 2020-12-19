var express = require('express');
var app = express();

var http = require('http').createServer(app);
const fs = require('fs');

let sslOptions = {
    key: fs.readFileSync('C:/Users/bin/privkey.pem'),//里面的文件替换成你生成的私钥
    cert: fs.readFileSync('C:/Users/bin/cacert.pem')//里面的文件替换成你生成的证书
};

const https = require('https').createServer(sslOptions, app);

https.listen(443, () => {
    console.log('https listen on');
});

var io = require('socket.io')(https);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    console.log("a user connected " + socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected: " + socket.id);
    })

    socket.on("chat message",(msg) => {
        console.log(socket.id + " say: " + msg);
        //io.emit("chat message", msg);
        socket.broadcast.emit("chat message", msg);
    })
})


http.listen(3000, () => {
    console.log('listening on *:3000');
});

// start https server

 
