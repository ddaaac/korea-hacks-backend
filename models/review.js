const mongoose = require('mongoose');
const util = require('../util');
const NodeCache = require("node-cache");
const Tag = require('./tag');

let myCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
});

let firstReviewCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
});

let reviewSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'userId should be requried']
        },
        tags: [{type: String, ref: 'tag'}],
        photos: [Buffer],                       // 한 도큐멘트의 최대 크기는 16MB
                                                // fs.readFileSync()로 읽어온 바이너리 그대로 저장하면 됨
        review: {
            type: String,
            required: [true, 'There should be any review'],     // 리뷰를 반드시 써야되는가?
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

reviewSchema.methods.increaseViews = function (userId) {
    if (myCache.has(userId)) {
        return false;
    }
    this.views++;
    myCache.set(userId, 1);
    return true;
}

reviewSchema.methods.saveTags = function (tags) {
    for (let idx in tags) {
        Tag.findOne({_id: tags[idx]}).exec(function (err, tag) {
            if (err) return err;
            if (!tag) {
                tag = new Tag({_id: tags[idx], reviewIds: [this._id]});
            } else {
                tag.reviewIds.push(this._id);
            }
            tag.save(function (err, tag) {
                if (err) {
                    return err;
                }
            });
        }.bind(this));
    }
    return null;
}

reviewSchema.pre('save', function (next) {
    let userId = this.userId.toString();
    let err = util.addExp(userId, 50);
    if (err) {
        return next(err);
    }
    if (!firstReviewCache.has(userId)) {
        let err = util.addExp(userId, 100);
        if (err) {
            return next(err);
        }

        firstReviewCache.set(userId, 1);
    }
    return next();
});

let Review = mongoose.model('review', reviewSchema);
module.exports = Review;