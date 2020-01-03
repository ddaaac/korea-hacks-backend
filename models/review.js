var mongoose = require('mongoose');
const NodeCache = require("node-cache");
let Tag = require('./tag')

const myCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
})

let reviewSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'userId should be requried']
        },
        tags: [String],
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

reviewSchema.methods.increaseViews = function (username) {
    if (myCache.has(username)) {
        return false;
    }
    this.views++;
    myCache.set(username, 1);
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

let Review = mongoose.model('review', reviewSchema);
module.exports = Review;