const redisClient = require('../redis');

module.exports.rateLimiter = (allowedAttempts, secondsExpiry) => 
    async (req, res, next) => {
        const ip = req.connection.remoteAddress.slice(0, 6);
        const [response] = await redisClient.multi().incr(ip).expire(ip, secondsExpiry).exec();
        if (response[1] > allowedAttempts) {
            res.json({loggedIn: false, status: "Too Many Attempts. Wait 10 Seconds"});
        } else {
            next();
        }
    }
