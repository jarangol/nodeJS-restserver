// ==================
//  Verify token
// =================
const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.get('Authorization') || req.headers['authorization'] || '';
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: true,
                err: 'Token provided is invalid.'
            })
        }

        req.user = decoded.user;
        next();
    });
};


// ==================
//  Verify admin role
// =================
let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            msg: "The user isn't an administrator"
        })
    }
};


// ==================
//  Verify img token
// =================
let verifyImgToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: true,
                err: 'Token provided is invalid.'
            })
        }

        req.user = decoded.user;
        next();
    });
};


module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyImgToken
};