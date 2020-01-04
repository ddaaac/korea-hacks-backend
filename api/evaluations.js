const express = require('express');
const router = express.Router();
const Evaluation = require('../models/evaluation');
const util = require('../util');

//create
router.post('/', util.isLoggedin, function (req, res, next) {
    let newEvaluation = new Evaluation(req.body);
    let err = newEvaluation.haveEvaluation(req.body.userId, req.body.reviewId);

    if (err) {
        res.json(util.successFalse(err));
    }

    newEvaluation.save()
        .then((evaluation) => {
            res.json(util.successTrue(evaluation));
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;