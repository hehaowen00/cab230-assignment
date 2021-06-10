const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret key';

// Checks if the request is using a valid JWT token
const AuthRequired = async (req, res, next) => {
    const { authorization } = req.headers;

    let token = undefined;

    if (authorization) {
        let split = authorization.split(" ");
        if (split.length !== 2 || split[0] !== 'Bearer') {
            res.status(401).json({
                error: true,
                message: 'Authorization header is malformed'
            });
            return;
        }
        token = split[1];
    } else {
        res.status(401).json({
            error: true,
            message: 'Authorization header (\'Bearer token\') not found'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        let result = await req.db.select('email').from('users').where('email', decoded.email);
        if (result.length !== 1 || result[0].email !== decoded.email) {
            throw 'invalid JWT';
        }

        if (decoded.exp < Date.now()) {
            res.status(401).json({
                error: true,
                message: 'JWT token has expired'
            });
            return;
        }
        req.decoded = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            error: true,
            message: 'Invalid JWT token'
        });
        return;
    }
};

// If a JWT token is invalid, access is denied
// If a JWT token is not provided, access is allowed
const AuthOptional = (req, res, next) => {
    req.authorized = req.headers.authorization ? true : false;
    if (req.authorized) {
        AuthRequired(req, res, next);
    } else {
        next();
    }
}

const generateJWT = (data) => {
    return jwt.sign(data, SECRET_KEY);
};

module.exports = {
    AuthRequired,
    AuthOptional,
    generateJWT
};
