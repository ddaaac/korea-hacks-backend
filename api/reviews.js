let express = require('express');
let router = express.Router();
let Review = require('../models/review');
let util = require('../util');

router.get('/', util.isLoggedin, function (req, res, next) {
    Review.find({})
        .sort({username: 1})
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });
});

router.post('/', util.isLoggedin, function (req, res, next) {
    let newReview = new Review(req.body);
    newReview.save(function (err, review) {
        res.json(err || !review ? util.successFalse(err) : util.successTrue(review));
    });
});

router.put('/:reviewId', util.isLoggedin, function (req, res, next) {
    Review.findOne({_id: req.params.reviewId})
        .exec(function (err, review) {
            if (err || !review) return res.json(util.successFalse(err));

            for (let key in req.body) {
                review[key] = req.body[key];
            }

            review.save(function (err, review) {
                if (err || !review) return res.json(util.successFalse(err));
                res.json(util.successTrue(review));
            });
        });
});

router.delete('/:reviewId', util.isLoggedin, function (req, res, next) {
    Review.findOneAndRemove({_id: req.params.reviewId})
        .exec(function (err, review) {
            res.json(err || !review ? util.successFalse(err) : util.successTrue(review));
        });
});

module.exports = router;