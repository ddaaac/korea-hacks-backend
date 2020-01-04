// [LOAD PACKAGES]
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
    next();
});

// [CONFIGURE SERVER PORT]
const port = process.env.PORT || 8000;

// [ CONFIGURE mongoose ]
mongoose.Promise = global.Promise;
// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(process.env.MONGO_DB_API);

// API
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/reviews', require('./api/reviews'));
app.use('/api/test', require('./api/test'));

// [RUN SERVER]
let server = app.listen(port, function () {
    console.log("Express server has started on port " + port)
});

