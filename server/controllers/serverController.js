const session = require('express-session');
const redisClient = require('../redis');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();
const friendParser = require('./friendParser');

const sessionMiddleware = session({
    secret: process.env.COOKIE_CODE,
    credentials: true,
    name: "asdf",
    store: new RedisStore({client: redisClient}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: 1000 * 60 * 60 * 24,
    }
});

const socketAuthorizeUser = async (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        next(new Error("Unauthorized"));
    } else {
        next();
    }
}

const socketInitializeUser = async (socket) => {
    socket.user = {...socket.request.session.user};
    socket.join(socket.user.userid);
    redisClient.hset(`userid:${socket.user.username}`, "userid", socket.user.userid, "connected", true);
    const friendList = await redisClient.lrange(`friendStack:${socket.user.username}`, 0, -1);
    const parsedFriendList = await friendParser(friendList);
    const friendRooms = parsedFriendList.map(friend => friend.userid);
    if (friendRooms.length > 0) {
        socket.to(friendRooms).emit("connected", true, socket.user.username);
    }
    socket.emit("friendList", parsedFriendList);
    const getUserMessages = await redisClient.lrange(`chat:${socket.user.userid}`, 0, -1);
    const messages = getUserMessages.map(message => {
        const parsedString = message.split(".");
        return { to: parsedString[0], from : parsedString[1], content: parsedString[2]};
    });
    if (messages && messages.length > 0) {
        socket.emit("messages", messages);
    }
    
}

const sendMessage = async (socket, message) => {
    message.from = socket.user.userid;
    const messageString = [message.to, message.from, message.content].join(".");
    await redisClient.lpush(`chat:${message.to}`, messageString);
    await redisClient.lpush(`chat:${message.from}`, messageString);
    socket.to(message.to).emit("sendMessage", message);
}

const addFriend = async (friendName, response, socket) => {
    if (friendName === socket.user.username) {
        response({friendAdded: false, error: "Cannot Add Yourself"});
        return;
    }
    const friendData = await redisClient.hgetall(`userid:${friendName}`);
    if (!friendData.userid) {
        response({friendAdded: false, error: "User Does Not Exist"});
        return;
    } 
    const currFriendList = await redisClient.lrange(`friendStack:${socket.user.username}`, 0, -1);
    if (currFriendList && currFriendList.indexOf(`${friendName}.${friendData.userid}`) !== -1) {
        response({friendAdded: false, error: "Friend Already Added"});
        return;
    }
    await redisClient.lpush(`friendStack:${socket.user.username}`, [friendName, friendData.userid].join("."));
    const newFriendData = {
        username: friendName,
        userid: friendData.userid,
        connected: friendData.connected,
    }
    response({friendAdded: true, newFriendData});
}

const disconnectUser = async (socket) => {
    await redisClient.hset(`userid:${socket.user.username}`, "connected", false);
    const friendList = await redisClient.lrange(`friendStack:${socket.user.username}`, 0, -1);
    const friendRooms = await friendParser(friendList).then(friends => {
        friends.map(friend => friend.userid);
    });
    socket.to(friendRooms).emit("connected", false, socket.user.username);
}

module.exports = { sessionMiddleware, socketInitializeUser, socketAuthorizeUser, sendMessage, addFriend, disconnectUser };