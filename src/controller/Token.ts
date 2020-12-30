const jwt = require('jsonwebtoken');
exports.generateToken = (user) => {
    const payload = { user: user };
    const options = { expiresIn: '365d', issuer: 'User' };
    const secret = "tsilmsdevsecretkey";
    const token = jwt.sign(payload, secret, options);
    return token;
}