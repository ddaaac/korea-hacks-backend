const mongoose = require('mongoose');
const util = require('../util');
const User = require('./user');

let evaluationSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'userId should be requried']
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'review_id should be requried']
        },
        gradePoint: {
            type: Number,
            required: [true, 'grade_point should be required'],
            min: 1,
            max: 5
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

evaluationSchema.pre('save', function (next) {
    Evaluation.findOne({userId: this.userId, reviewId: this.reviewId})
        .exec(function (err, evaluation) {
            if (err) return next(err);
            if (evaluation) {
                return next("Already have evaluation");
            }
            let error = util.addExp(this.userId.toString(), (1/2)*(this.gradePoint**2));
            if (error) return next(error);
            return next();
        });
});

let Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = Evaluation;