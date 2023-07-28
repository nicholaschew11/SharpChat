const {v4: uuidv4} = require('uuid');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const redisClient = require('../redis');

module.exports.handleLogin = (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({loggedIn: true, username: req.session.user.username});
    } else {
        res.json({loggedIn: false});
    }
}

module.exports.registerAttempt = async (req, res) => {
    const existingUser = await pool.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );
    if (existingUser.rowCount === 0) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await pool.query(
            "INSERT INTO users(username, passwordhash, userid) values($1, $2, $3) RETURNING id, username, userid", 
            [req.body.username, hashedPassword, uuidv4()]
        );
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid,
        }
        res.json({loggedIn: true, username: req.body.username});
        return;
    } else {
        res.json({loggedIn: false, status: "Username Taken"})
        return;
    }
}

module.exports.loginAttempt = async (req, res) => {
    const loginAttempt = await pool.query(
        "SELECT id, username, passwordhash, userid FROM users u WHERE u.username=$1",
        [req.body.username]
    );

    if (loginAttempt.rowCount > 0) {
        const samePassword = await bcrypt.compare(req.body.password, loginAttempt.rows[0].passwordhash);
        if (samePassword) {
            req.session.user = {
                username: req.body.username,
                id: loginAttempt.rows[0].id,
                userid: loginAttempt.rows[0].userid,
            }
            res.json({ loggedIn: true, username: req.body.username});
        } else {
            //password wrong for user
            res.json({ loggedIn: false, status: "Wrong Username or Password"});
        }
    } else {
        //user no exist
        res.json({ loggedIn: false, status: "Wrong Username or Password"});
    }
}

module.exports.logoutUser = async (req, res) => {
    req.session.destroy();
    await redisClient.del(`userid:${req.body.userid}`);
    res.json({ loggedIn: false });
}