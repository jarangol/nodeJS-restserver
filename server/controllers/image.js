const express = require('express');

const fs = require('fs');
const path = require('path');

const { verifyImgToken } = require('../middlewares/authentication');

const app = express();

app.get('/image/:type/:img', verifyImgToken, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = `./uploads/${type}/${img}`;

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/image-not-found.png');
        res.sendFile(noImagePath);
    }

});

module.exports = app;