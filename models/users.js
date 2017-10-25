var mongoose = require('mongoose'), Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    firstName: String,
    lastName: String,
    avatar: String,
    facebook: {
        id: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        }
    },
    twitter: {
        id: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        }
    },
    token: {
        type: String,
        required: false
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            avatar: this.avatar,
            exp: parseInt(expiry.getTime() / 1000)
        }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('Users', userSchema);