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

app.get('/record', (req, res) => {
    res.sendFile(__dirname + '/record2.html');
});

app.get('/camera_test', (req, res) => {
    res.sendFile(__dirname + '/camera_test.html');
});
app.get('/old', (req, res) => {
    res.sendFile(__dirname + '/old.html');
});



io.on("connection", (socket) => {
    socket.join( socket.id );

    console.log("a user connected " + socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected: " + socket.id);
        socket.broadcast.emit('user disconnected', socket.id);

    })

    socket.on("chat message",(msg) => {
        console.log(socket.id + " say: " + msg);
        //io.emit("chat message", msg);
        socket.broadcast.emit("chat message", msg);
    })

//     socket.on( 'subscribe', ( data ) => {
//         //subscribe/join a room
//         //socket.join( data.room );
//         console.log(data);
//         console.log(data.room);
  
//         socket.join(data.room);
//         socket.join(data.socketID);
//         socket.to(data.room).emit('new user', { socketID: data.socketID } );//似乎是发送除了自己的其它玩家

//     } );

//     socket.on( 'newUserStart', ( data ) => {
//       socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
//   } );


    socket.on('new user greet', (data) => {
        console.log(socket.id + ' greet ' + data.msg);
        socket.broadcast.emit('need connect', {sender: socket.id, msg : data.msg});
    });

    socket.on('ok we connect', (data) => {
        io.to(data.receiver).emit('ok we connect', {sender : data.sender});
    });


    socket.on( 'sdp', ( data ) => {
        console.log('sdp');
        console.log(data.description);
        //console.log('sdp:  ' + data.sender + '   to:' + data.to);
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );

    socket.on( 'ice candidates', ( data ) => {
        console.log('ice candidates:  ');
        console.log(data);
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );
})






https.listen(4443, () => {
    console.log('https listening on *:4443');
});