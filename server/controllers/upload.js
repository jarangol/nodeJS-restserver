const express = require('express');
const fileUpload = require('express-fileupload');

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                    ok: false,
                    err: {
                        msg: "It has't been selected an image."
                    }
                }

            )
    }
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: "The allowed types are: " + validTypes.join(', '),
                type
            }
        });
    }

    let file = req.files.file;
    let fileNameSplit = file.name.split('.');
    let fileExtension = fileNameSplit[fileNameSplit.length - 1];
    let validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: "The allowed file extensions are: " + validExtensions.join(', '),
                extension: fileExtension
            }
        });
    }

    let fileName = `${id}-${ new Date().getMilliseconds() }.${fileExtension}`

    file.mv(`uploads/${ type }/${ fileName }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (type === 'users')
            userImage(id, res, fileName);
        else
            productImage(id, res, fileName);
    });


});


function userImage(id, res, fileName) {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400)
                .json({
                    ok: false,
                    msg: "User does't exist."
                });
        }

        deleteFile(userDB.img, 'users')
        userDB.img = fileName;

        userDB.save((err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser
            });
        });
    });

};

function productImage() {

}

function deleteFile(fileName, type) {
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    console.log(imagePath);

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = app;