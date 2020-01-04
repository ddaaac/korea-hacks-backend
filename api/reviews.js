const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const util = require('../util');

const NUM_LIST = 10;
const DATE_LIMIT = 1;

// Get all reviews
router.get('/', util.isLoggedin, function (req, res, next) {
    Review.find({})
        .sort({updated_at: 1})
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });
});

// Get reviews of a user
router.get('/:userId', util.isLoggedin, function (req, res, next) {
    Review.find({userId: req.params.userId})
        .sort({updated_at: 1})
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });
});

router.get('/popular/:from', util.isLoggedin, function (req, res, next) {
    let cufOff = new Date();
    cufOff.setDate(cufOff.getDate() - DATE_LIMIT);
    Review.find({updated_at: {$lt : cufOff}})
        .sort('-views')
        .limit(parseInt(req.params.from) + NUM_LIST)
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        })
});

router.get('/newest/:from', util.isLoggedin, function (req, res, next) {
    const from = parseInt(req.params.from);
    Review.find()
        .sort('-updated_at')
        .limit(from + NUM_LIST)
        .exec(function (err, reviews) {
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews.slice(-1 * NUM_LIST)));
        })
})

// Create review
router.post('/', util.isLoggedin, function (req, res, next) {
    //first review check
    let newReview = new Review(req.body);

    if (req.body.tags) {
        let err = newReview.saveTags(req.body.tags);
        if (err) return res.json(util.successFalse(err));
    }

    newReview.save(function (err, review) {
        res.json(err || !review ? util.successFalse(err) : util.successTrue(review));
    });
});

// Modify review
router.put('/:reviewId', util.isLoggedin, function (req, res, next) {
    Review.findOne({_id: req.params.reviewId})
        .exec(function (err, review) {
            if (err || !review) return res.json(util.successFalse(err));

            for (let key in req.body) {
                review[key] = req.body[key];
            }

            if (req.body.tags) {
                let err = review.saveTags(req.body.tags);
                if (err) return res.json(util.successFalse(err));
            }

            review.save(function (err, review) {
                if (err || !review) return res.json(util.successFalse(err));
                res.json(util.successTrue(review));
            });
        });
});

// Remove review
router.delete('/:reviewId', util.isLoggedin, function (req, res, next) {
    Review.findOneAndRemove({_id: req.params.reviewId})
        .exec(function (err, review) {
            res.status(204).send();
        });
});

// Increase view of a review
router.put('/increase-view/:reviewId', function (req, res, next) {
    Review.findOne({_id: req.params.reviewId})
        .exec(function (err, review) {
            if (err || !review) return res.json(util.successFalse(err));
            if (!req.body.userId) return res.json(util.successFalse(null, "UserId required"));
            if (!review.increaseViews(req.body.userId, review))
                return res.json(util.successFalse(null, "One user per one day"));

            review.save(function (err, review) {
                if (err || !review) return res.json(util.successFalse(err));
                res.json(util.successTrue(review));
            });
        });
});

module.exports = router;