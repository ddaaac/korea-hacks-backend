const express = require('express');
const router = express.Router();
const Evaluation = require('../models/evaluation');
const util = require('../util');

//create
router.post('/', util.isLoggedin, function (req, res, next) {
    let newEvaluation = new Evaluation(req.body);
    newEvaluation.save(function (err, evaluation) {
        if (err || !evaluation) return res.json(util.successFalse(err));
        res.json(util.successTrue(evaluation));
    });
});

//show
router.get('/', util.isLoggedin, function(req, res, next) {
    Evaluation.findOne({userId: req.body.userId}, {reviewId: req.body.reviewId})
              .select({_id:1, userId:1, reviewId:1, gradepoint:1, created_at:1, updated_at:1})
              .exec(function (err, evaluation) {
                  res.json(err || !evaluation ? util.successFalse(err) : util.successTrue(evaluation));
              });
});

router.get('/:reviewId/:gradePoint/:from', util.isLoggedin, function(req, res, next) {
    const from = parseInt(req.params.from);
    Evaluation.find({reviewId: req.params.reviewId})
        .where('gradePoint').equals(req.params.gradePoint)
        .sort('-date')
        .limit(from+10)
        .exec(function (err, evaluations) {
            res.json(err || !evaluations ? util.successFalse(err) : util.successTrue(evaluations.slice(-10)));
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