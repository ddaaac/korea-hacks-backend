const mongoose = require('mongoose');
const util = require('../util');
const Tag = require('./tag');
const Evaluation = require('./evaluation')

const REVIEW_EXP = 50;
const FIRST_REVIEW_EXP = 100;
const USER_EXIST = 1;

let myCache = util.makeOneDayCache();

let firstReviewCache = util.makeOneDayCache();

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
        },
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

reviewSchema.virtual('evaluation')
    .get(function () {
        return Evaluation.find({reviewId: this.reviewId})
            .exec(function (err, evaluations) {
                let sumEvaluation = 0;
                for (let eval in evaluations) {
                    sumEvaluation += eval.gradePoint;
                }
                return sumEvaluation / evaluations.length;
            });
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

    if (!firstReviewCache.has(userId)) {
        let err = util.addExp(userId, FIRST_REVIEW_EXP + REVIEW_EXP);
        if (err) {
            return next(err);
        }

        firstReviewCache.set(userId, USER_EXIST);
    } else {
        let err = util.addExp(userId, REVIEW_EXP);
        if (err) {
            return next(err);
        }
    }
    return next();
});

let Review = mongoose.model('review', reviewSchema);
module.exports = Review;