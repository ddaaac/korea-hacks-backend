//util.js

const jwt = require('jsonwebtoken');
const NodeCache = require("node-cache");

const User = require('./models/user');

const ONE_DAY_EXP_THRESHOLD = 500;
const NO_ERROR = undefined;
const ONE_DAY_IN_SECOND = 60 * 60 * 24;

let util = {};


util.successTrue = function (data) { //1
    return {
        success: true,
        message: null,
        errors: null,
        data: data
    };
};

util.successFalse = function (err, message) { //2
    if (!err && !message) message = 'data not found';
    return {
        success: false,
        message: message,
        errors: (err) ? util.parseError(err) : null,
        data: null
    };
};

util.parseError = function (errors) { //3
    let parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = {message: validationError.message};
        }
    } else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = {message: 'This username already exists!'};
    } else {
        parsed.unhandled = errors;
    }
    return parsed;
};


// middlewares
util.isLoggedin = function (req, res, next) { //4
    let token = req.headers['x-access-token'];
    if (!token) return res.json(util.successFalse(null, 'token is required!'));
    else {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return res.json(util.successFalse(err));
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
};

util.addExp = function (userId, exp) {
    if (expCache.has(userId) && (expCache.get(userId) > ONE_DAY_EXP_THRESHOLD)) {
        return "Exceed maximum exp per day!";
    }
    if (!expCache.has(userId)) {
        expCache.set(userId, 0);
    }
    User.findOne({_id: userId})
        .exec(function (err, user) {
            if (err) return err;
            expCache.set(userId, expCache.get(userId) + exp);
            user.exp += exp;
            user.save(function (err, user) {
                if (err) return err;
            });
            return NO_ERROR;
        });
}

util.makeOneDayCache = function () {
    return new NodeCache({
        stdTTL: ONE_DAY_IN_SECOND,
    });
}

util.makeDayLimit = function (dayLimit) {
    let cufOff = new Date();
    cufOff.setDate(cufOff.getDate() - dayLimit);
    return cufOff;
}

util.makeStringToList = function(str) {
    str = str.slice(1, str.length - 1);
    let strList = str.replace(/"/g, "")
        .replace(/#/g, "")
        .split(',');
    while(strList.indexOf("") > -1) {
        strList.splice(d.indexOf(""), 1)
    }

    return strList;
}

module.exports = util;

let expCache = util.makeOneDayCache();
