const express = require('express');

const fs = require('fs');

const app = express();

app.get('/:type/:img', (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = `./uploads/${type}/${img}`;

    res.s

});

module.exports = app;