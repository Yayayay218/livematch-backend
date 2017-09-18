var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var tokenSchema = new mongoose.Schema({
    token: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
});

tokenSchema.plugin(mongoosePaginate);
mongoose.model('Tokens', tokenSchema);