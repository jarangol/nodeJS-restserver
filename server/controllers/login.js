const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');

const app = express();

const client = new OAuth2Client(process.env.G_CLIENT_ID);


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    msg: "Incorrect user or password"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    msg: "Incorrect user or password"
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCITY });

        res.json({
            ok: true,
            user: userDB,
            token
        })

    });
});

// google confg
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.G_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    User.findOne({ email: googleUser.email }, async(err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Should use your normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCITY });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }

        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = '-_-';

            await user.save().
            then(userDB => {
                    let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCITY });

                    return res.json({
                        ok: true,
                        user: userDB,
                        token
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                });
        }
    });
});

module.exports = app;