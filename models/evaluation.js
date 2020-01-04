const mongoose = require('mongoose');
const HAVE_EVALUATION = 1;
const HAVE_NOT_EVALUATION = 0;
const ERROR = -1;

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
            min: 0,
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
            return next();
        });
});

let Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = Evaluation;