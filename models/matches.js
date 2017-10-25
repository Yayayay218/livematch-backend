var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var matchSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    time: Number,
    status: Number,
    isRequired: Boolean,
    index: Number,
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

matchSchema.plugin(mongoosePaginate);
mongoose.model('Matches', matchSchema);