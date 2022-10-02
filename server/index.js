const express = require('express');
const http = require("http");
const cors = require("cors");
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
const RedisStore = require('connect-redis')(session);

const authRouter = require('./authRouter');
const redisClient = require('./redis');
const { 
    sessionMiddleware,
    socketAuthorizeUser,
    addFriend,
    disconnectUser,
    socketInitializeUser,
    sendMessage
} = require('./controllers/serverController');

const app = express();
const PORT = 3030;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);

// app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname + "/build")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.use(socketAuthorizeUser);

io.on("connect", (socket) => {
    socketInitializeUser(socket);

    socket.on("sendMessage", (message) => sendMessage(socket, message));
    socket.on("addFriend", (friendName, response) => {addFriend(friendName, response, socket)});
    socket.on("disconnecting", () => disconnectUser(socket));
});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});