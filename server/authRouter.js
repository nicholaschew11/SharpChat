const express = require('express');
const validate = require('./controllers/validate');
const router = express.Router();
const { rateLimiter } = require('./controllers/rateLimiter');

const {handleLogin, loginAttempt, registerAttempt, logoutUser} = require("./controllers/authController");

router.route("/login").get(handleLogin).post(validate, rateLimiter(5, 10), loginAttempt);
router.post("/signup", validate, rateLimiter(5, 10), registerAttempt);
router.post("/logout", logoutUser);

module.exports = router;