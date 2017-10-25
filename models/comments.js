var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var commentSchema = new mongoose.Schema({
    content: String,
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    reportCount : {
        type: Number,
        default: 0
    },
    image: String,
    match: {type: Schema.Types.ObjectId, ref: 'Matches'},
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

commentSchema.plugin(mongoosePaginate);
mongoose.model('Comments', commentSchema);