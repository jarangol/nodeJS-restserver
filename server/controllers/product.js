const express = require('express');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

let Product = require('../models/product');

app.get('/products', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);
    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec()
        .then(products => {
            return res.json({
                ok: true,
                products
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});

app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        msg: "The id is incorrect"
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });
});

app.get('/products/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;

    let regex = new RegExp(term, 'i');
    Product.find({ name: regex })
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec()
        .then(products => {
            return res.json({
                ok: true,
                products
            });
        })
        .catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        user: req.user._id,
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category
    });

    product.save()
        .then(productDB => {
            res.status(200).json({
                ok: true,
                product: productDB
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                err
            });
        });
});

app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, body, { new: true, }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

app.delete('/product/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, productDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: "The id doesn't exist"
                }
            });
        }

        productDB.available = false;
        productDB.save((err, deletedProduct) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: deletedProduct,
                msg: 'Product deleted'
            });
        });

    });
});

module.exports = app;