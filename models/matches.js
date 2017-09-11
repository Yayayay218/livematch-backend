var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var channelSchema = new mongoose.Schema({
    name: String,
    link: String,
    status: Number
});

var matchSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    time: Date,
    status: Number,
    isRequired: Boolean,
    channels: [channelSchema],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

matchSchema.plugin(mongoosePaginate);
mongoose.model('Matches', matchSchema);