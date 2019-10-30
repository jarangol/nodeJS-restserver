const express = require('express');

const app = express();

const user_controller = require('./user');
app.use(user_controller);

const login_controller = require('./login');
app.use(login_controller);


module.exports = app;