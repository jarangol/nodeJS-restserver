require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({

        });
    }
    res.json({
        body
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});