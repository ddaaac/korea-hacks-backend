const mongoose = require('mongoose');

let tagSchema = mongoose.Schema({
    _id: String,
    reviewIds: [mongoose.Schema.Types.ObjectId],
});

let Tag = mongoose.model('tag', tagSchema);
module.exports = Tag;