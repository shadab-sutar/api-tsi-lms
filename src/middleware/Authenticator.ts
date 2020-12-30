const jwt = require('jsonwebtoken');
import * as redis from 'redis';

const redisPort = 6379;
const redisClient = redis.createClient(redisPort);

exports.Authenticator = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    let result;
    if (authHeaders) {
        const token = req.headers.authorization.split(' ')[1];
        const options = { expiresIn: '365d', issuer: 'User' };
        const secret = "tsilmsdevsecretkey";
        try {
            console.log("Inside Authenticator");
            result = jwt.verify(token, secret);
            redisClient.get(result.user, function (err, response) {
                if (token === response) {
                    console.log("For next");
                    return next();
                } else {
                    console.log('redisError', err);
                }
            });
        } catch (err) {
            res.json(err);
        }
    } else {
        res.json({
            message: "Unauthorized user"
        });
    }
}


