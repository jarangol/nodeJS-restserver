const _ = require('underscore');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const express = require('express');
const app = express();

app.get('/users', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec()
        .then(users => {

            User.countDocuments({ status: true })
                .skip(from)
                .limit(limit)
                .then(length => {
                    return res.json({
                        ok: true,
                        users,
                        length
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            })
        });
});

app.post('/user', [verifyToken, verifyAdminRole], function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    user.save()
        .then(userDB => {
            res.json({
                ok: true,
                user: userDB
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                err
            });
        })
});

app.put('/user/:id', [verifyToken, verifyAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });


});

app.delete('/user/:id', [verifyToken, verifyAdminRole], function(req, res) {
    let id = req.params.id;
    User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, userDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

module.exports = app;