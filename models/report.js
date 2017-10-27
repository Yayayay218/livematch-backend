var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var reportSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    comment: {type: Schema.Types.ObjectId, ref: 'Comments'},
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

reportSchema.plugin(mongoosePaginate);
mongoose.model('Reports', reportSchema);