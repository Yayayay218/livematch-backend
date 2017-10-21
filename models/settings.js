var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var settingSchema = new mongoose.Schema({
    name: String,
    status: Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

settingSchema.plugin(mongoosePaginate);
mongoose.model('Settings', settingSchema);