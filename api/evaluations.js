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

module.exports = router;