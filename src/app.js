const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {passport} = require('./config/config.passport');
const chatsModule = require('./modules/chatsModule');


const app = express();
const server = http.Server(app);
const io = socketIO(server)

const logger = require('./middleware/logger');
const router = require("./routers");
const {sessionMiddleware, session} = require('./middleware/session');

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize()); 
app.use(passport.session());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(router);
app.use(logger);

const {sendMessage, getHistory} = require('./io/ioHandlers')(io);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

const onConnection = (socket) => {
    if (!socket.request.isAuthenticated || !socket.request.isAuthenticated()) {
        console.log("Пользователь неавторизован ", socket.id);
    } else { 
        console.log("Пользователь авторизован - чат доступен ", socket.request.user.id);
        chatsModule.subscribe(socket);              
        
        socket.on('getHistory', getHistory);
        socket.on('sendMessage', sendMessage);
    }
};

io.on('connection', onConnection);


const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const UrlDb =  process.env.DB_HOST || 'mongodb://root:example@mongo:27017/';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'todos';

const start = async() => {
    try {
        await mongoose.connect(UrlDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        server.listen(PORT, console.log(`Server has started on port: ${PORT}`));

    } catch (err) {
        console.log(err);
    }
};

start();