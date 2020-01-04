const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const util = require('../util');

// Get reviews of a tag
router.get('/:tagId/:userId', util.isLoggedin, function (req, res, next) {
    Tag.findOne({_id: req.params.tagId})
        .populate('reviewIds').exec(function (err, tag) {
        User.findOne({_id: req.params.userId})
            .exec(function (err, user) {
                user.tags.push(req.params.tagId);
                user.save(function (err, user) {
                    if (err) return res.json(util.successFalse(err));
                });
            });
        res.json(err || !reviews ? util.successFalse(err) : util.successTrue(tag.reviewIds));
    });

});


module.exports = router;