const express = require('express');

const app = express();

app.use(require('../controllers/user'));
app.use(require('../controllers/login'));
app.use(require('../controllers/category'));
app.use(require('../controllers/product'));
app.use(require('../controllers/upload'));
app.use(require('../controllers/image'));

module.exports = app;