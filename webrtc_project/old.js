var express = require('express');
var app = express();
var http = require('http').createServer(app);

var fs = require('fs');
let sslOptions = {
    key: fs.readFileSync('C:/privkey.key'),//里面的文件替换成你生成的私钥
    cert: fs.readFileSync('C:/cacert.pem')//里面的文件替换成你生成的证书
};

const https = require('https').createServer(sslOptions, app);

var io = require('socket.io')(https);

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/camera', (req, res) => {
    res.sendFile(__dirname + '/camera.html');
});


io.on("connection", (socket) => {
    socket.join( socket.id );

    console.log("a user connected " + socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected: " + socket.id);
    });

    socket.on("chat message",(msg) => {
        console.log(socket.id + " say: " + msg);
        //io.emit("chat message", msg);
        socket.broadcast.emit("chat message", msg);
    })

});






https.listen(443, () => {
    console.log('https listening on *:4443');
});