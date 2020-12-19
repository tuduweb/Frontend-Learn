var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

//还需要确定一下路由的方式
app.get('/record2', (req, res) => {
    res.sendFile(__dirname + '/record2.html');
})


app.use("/static", express.static('static/'));



io.on('connection', (socket) => {
    socket.join(socket.id);
    //当建立连接时，可以选择服务器自动发送当前存在的用户出来
    console.log('a user connected : ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected : ' + socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
    });

    socket.on('chat message', (msg) => {
        console.log(socket.id + ' say: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('new user greet', (data) => {
        console.log(socket.id + ' greet ' + data.msg);
        socket.broadcast.emit('need connect', {sender: socket.id, msg : data.msg});
    })

    socket.on('ok we connect', (data) => {
        io.to(data.receiver).emit('ok we connect', {sender : data.sender});
    })

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

// const fs = require('fs');
// const https = require('https');
// // start https server
// let sslOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//  };
 
//  let serverHttps = https.createServer(sslOptions, app).listen(443);