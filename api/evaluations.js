const express = require('express');
const router = express.Router();
const Evaluation = require('../models/evaluation');
const util = require('../util');

const NUM_LIST = 10;

//create
router.post('/', util.isLoggedin, function (req, res, next) {
    let newEvaluation = new Evaluation(req.body);
    newEvaluation.save(function (err, evaluation) {
        if (err || !evaluation) return res.json(util.successFalse(err));
        res.json(util.successTrue(evaluation));
    });
});

//show
router.get('/find-one/:userId/:reviewId', util.isLoggedin, function (req, res, next) {
    Evaluation.findOne({userId: req.params.userId, reviewId: req.params.reviewId})
        .exec(function (err, evaluation) {
            res.json(err || !evaluation ? util.successFalse(err) : util.successTrue(evaluation));
        });
});

router.get('/newest/:reviewId/:from', util.isLoggedin, function (req, res, next) {
    const from = parseInt(req.params.from);
    Evaluation.find({reviewId: req.params.reviewId})
        .sort('-updated_at')
        .limit(from + NUM_LIST)
        .exec(function (err, evaluations) {
            res.json(err || !evaluations ? util.successFalse(err) : util.successTrue(evaluations.slice(-1 * NUM_LIST)));
        })
});

router.get('/gradePoint/:gradePoint/:reviewId/:from', util.isLoggedin, function (req, res, next) {
    const from = parseInt(req.params.from);
    Evaluation.find({reviewId: req.params.reviewId})
        .where('gradePoint').equals(req.params.gradePoint)
        .sort('-updated_at')
        .limit(from + NUM_LIST)
        .exec(function (err, evaluations) {
            res.json(err || !evaluations ? util.successFalse(err) : util.successTrue(evaluations.slice(-1 * NUM_LIST)));
        })
});

router.get('/recommend/:reviewId/:from', util.isLoggedin, function (req, res, next) {
    const from = parseInt(req.params.from);
    Evaluation.find({reviewId: req.params.reviewId})
        .sort('-gradePoint -updated_at')
        .limit(from + NUM_LIST)
        .exec(function (err, evaluations) {
            res.json(err || !evaluations ? util.successFalse(err) : util.successTrue(evaluations.slice(-1 * NUM_LIST)));
        })
});

//delete
router.delete('/', util.isLoggedin, function (req, res, next) {
    Evaluation.findOneAndRemove({userId: req.body.userId, reviewId: req.body.reviewId})
        .exec(function (err, evaluation) {
            res.json(err || !evaluation ? util.successFalse(err) : util.successTrue(evaluation));
        });
});

module.exports = router;