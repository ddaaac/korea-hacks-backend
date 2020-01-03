let express = require('express');
let router = express.Router();
let Review = require('../models/review');
let util = require('../util');

router.get('/', util.isLoggedin, function (req, res, next) {
    Review.find({})
        .sort({updated_at: 1})
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });
});

router.get('/:userId', util.isLoggedin, function (req, res, next) {
    Review.find({userId: req.params.userId})
        .sort({updated_at: 1})
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });
});

router.post('/', util.isLoggedin, function (req, res, next) {
    let newReview = new Review(req.body);

    if (req.body.tags) {
        let err = newReview.saveTags(req.body.tags);
        if (err) return res.json(util.successFalse(err));
    }

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

            if (req.body.tags) {
                let err = newReview.saveTags(req.body.tags);
                if (err) return res.json(util.successFalse(err));
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

router.put('/increase-view/:reviewId', function (req, res, next) {
    Review.findOne({_id: req.params.reviewId})
        .exec(function (err, review) {
            if (err || !review) return res.json(util.successFalse(err));
            if (!req.body.username) return res.json(util.successFalse(null, "Username required"));
            if (!review.increaseViews(req.body.username, review))
                return res.json(util.successFalse(null, "One user per one day"));

            review.save(function (err, review) {
                if (err || !review) return res.json(util.successFalse(err));
                res.json(util.successTrue(review));
            });
        });
});

module.exports = router;