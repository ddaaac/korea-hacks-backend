// models/review.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

let reviewSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    photos: [Buffer],                       // 한 도큐멘트의 최대 크기는 16MB
                                            // fs.readFileSync()로 읽어온 바이너리 그대로 저장하면 됨
    review: {
        type: String,
        required: [true, 'There should be any review'],     // 리뷰를 반드시 써야되는가?
    },
    ratingList: [new mongoose.Schema({
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
            required: [true, 'You should rate for the review']
        },
    })],

});