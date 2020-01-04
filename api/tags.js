const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const User = require('../models/user');
const util = require('../util');

// Get reviews of a tag
router.get('/:tagId/:userId', util.isLoggedin, function (req, res, next) {
    Tag.findOne({_id: req.params.tagId})
        .populate('reviewIds').exec(function (err, tag) {
        User.findOne({_id: req.params.userId})
            .exec(function (err, user) {
                if (!user.tags.includes(req.params.tagId)) {
                    user.tags.push(req.params.tagId);
                }
                user.save(function (err, user) {
                    if (err) return res.json(util.successFalse(err));
                });
            });
        let reviews = tag.reviewIds;
        res.json(err || !reviews ? util.successFalse(err) : util.successTrue(reviews));
    });

});


module.exports = router;