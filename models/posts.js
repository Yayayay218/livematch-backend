var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var postSchema = new mongoose.Schema({
    name: String,
    description: String,
    link: String,
    label: String,
    status: Number,
    isRequired: Boolean,
    type: Number,
    coverPhoto: String,
    isShow: {
        type: Boolean,
        default: false
    },
    match: {type: Schema.Types.ObjectId, ref: 'Matches'},
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

postSchema.plugin(mongoosePaginate);
mongoose.model('Posts', postSchema);