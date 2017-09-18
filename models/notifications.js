var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var notificationSchema = new mongoose.Schema({
    token: String,
    match: {type: Schema.Types.ObjectId, ref: 'Matches'},
    status: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

notificationSchema.plugin(mongoosePaginate);
mongoose.model('Notifications', notificationSchema);