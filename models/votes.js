var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var voteSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    comment: {type: Schema.Types.ObjectId, ref: 'Comments'},
    channel: {type: Schema.Types.ObjectId, ref: 'Channels'},
    type: Number,
    status: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

voteSchema.plugin(mongoosePaginate);
mongoose.model('Votes', voteSchema);