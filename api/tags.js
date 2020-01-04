const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const util = require('../util');

// Get reviews of a tag
router.get('/:tagId', util.isLoggedin, function (req, res, next) {
    Tag.findOne({_id: req.params.tagId})
        .exec(function (err, tag) {
            res.json(err || !tag ? util.successFalse(err) : util.successTrue(tag));
        });
});


module.exports = router;