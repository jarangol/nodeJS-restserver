require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.use(require('./controllers/routes'));

mongoose.connect(process.env.urlDB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log('Database online'))
    .catch(err => {
        throw new Error('Error while connecting to mongo')
    });

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});