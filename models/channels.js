var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var channelSchema = new mongoose.Schema({
    name: String,
    link: String,
    status: Number,
    isShow: {
        type: Boolean,
        default: false
    },
    showDis: {
        type: Boolean,
        default: true
    },
    match: {type: Schema.Types.ObjectId, ref: 'Matches'},
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

channelSchema.plugin(mongoosePaginate);
mongoose.model('Channels', channelSchema);