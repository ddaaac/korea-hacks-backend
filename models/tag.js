const mongoose = require('mongoose');

let tagSchema = mongoose.Schema({
    _id: String,
    reviewIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'review'}],
});

let Tag = mongoose.model('tag', tagSchema);
module.exports = Tag;