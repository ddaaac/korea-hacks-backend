// [LOAD PACKAGES]
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

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
var port = process.env.PORT || 8000;

// [ CONFIGURE mongoose ]
mongoose.Promise = global.Promise;
// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(process.env.MONGO_DB_API);

// API
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));

// [RUN SERVER]
var server = app.listen(port, function () {
    console.log("Express server has started on port " + port)
});
