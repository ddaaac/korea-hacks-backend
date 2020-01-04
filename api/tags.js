const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const util = require('../util');

// Get reviews of a tag
router.get('/:tagId', util.isLoggedin, function (req, res, next) {
    Tag.findOne({_id: req.params.tagId})
        .populate('reviewIds').exec(function (err, tag) {
            const reviews = tag.reviewIds;
            res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
        });

});


module.exports = router;