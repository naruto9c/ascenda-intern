const express = require('express');
const bodyparser = require('body-parser');
const router = require('./src/routes/index.route');

const app = express();

const port = 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));


app.use('/', router);

app.listen(port, (req, res) => {
    console.log('Server is ready!');
});

module.exports = app;
