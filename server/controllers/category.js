const express = require('express');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

let Category = require('../models/category');

app.get('/categories', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec()
        .then(categories => {
            return res.json({
                ok: true,
                categories
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});

app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: "The id is incorrect"
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save()
        .then(categoryDB => {
            res.json({
                ok: true,
                category: categoryDB
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});

app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let catDescription = {
        description: body.description
    }
    Category.findByIdAndUpdate(id, catDescription, { new: true, runValidators: true, useFindAndModify: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: "The id doesn't exist."
                }
            });
        }

        res.json({
            ok: true,
            msg: 'Category deleted.'
        });
    });
});

module.exports = app;