var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var express2 = require('express');
var http = require('http').createServer(express2);
var io = require('socket.io')(http,{
    //maxHttpBufferSize: 1e8,
    //origins: '*:*',
    cors: {
      origin: true,//跨域(端口)访问
      methods: ["GET", "POST"]
    }
  });
io.on('connection', (socket) => {
    console.log(socket.id);
    //socket.emit('connect', 1);

    //信令转发
    socket.on('message', (message) => {
        console.log(message);
        socket.emit('message', message);
    });

    socket.on( 'subscribe', ( data ) => {
        //subscribe/join a room
        //socket.join( data.room );
        console.log(data);
        console.log(data.room);
  
        socket.join(data.room);
        socket.join(data.socketID);
        socket.to(data.room).emit('new user', { socketID: data.socketID } );//似乎是发送除了自己的其它玩家

    } );

    socket.on( 'newUserStart', ( data ) => {
      socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
  } );

    socket.on( 'sdp', ( data ) => {
        console.log(data);
        //console.log('sdp:  ' + data.sender + '   to:' + data.to);
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );

    socket.on( 'ice candidates', ( data ) => {
        console.log('ice candidates:  ' + data.sender);
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );

});

// socket.on( 'chat', ( data ) => {
//   socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
// } );

// io.on("connection", (socket) => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });

http.listen(12312, _ => {
  console.log("server running on 12312");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
