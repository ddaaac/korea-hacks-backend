var mongoose = require('mongoose');

let evaluationSchema = mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'userId should be requried']
        },
        review_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'review_id should be requried']
        },
        grade_point: {
            type: Number,
            required: [true, 'grade_point should be required']
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

let Evaluation = mongoose.model('evaluation', evaluationSchema);
module.exports = Evaluation;