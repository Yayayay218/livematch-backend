var passport = require('passport');
var mongoose = require('mongoose');
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var CryptoJS = require('crypto-js');

var encrypt = require('../helpers/lib/encryptAPI');

mongoose.Promise = global.Promise;
var User = mongoose.model('Users');
var Votes = mongoose.model('Votes');
var Channels = mongoose.model('Channels');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    var user = new User();

    user.email = req.body.email;

    user.setPassword(req.body.password);
    var token;
    token = user.generateJwt();
    user.token = 'Bearer ' + token;
    user.save(function (err) {
        res.status(200);
        res.json({
            "token": token
        });
    });
};

module.exports.login = function (req, res) {

    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            var results = {
                token: 'Bearer ' + token
            }

            res.status(200);
            res.json(results);
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports.loginSocial = function (req, res) {
    var user = req.user;
    var token = user.generateJwt();
    user.token = 'Bearer ' + token;
    user.save(function (err, data) {
        if (err) {
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR)
            return res.send(err);
        } else {
            var results = {
                success: true,
                token: 'Bearer ' + token
            };

            res.status(HTTPStatus.OK);
            return res.json(results);
        }
    });
}

module.exports.userGETInfo = function (req, res) {

    sendJSONResponse(res, 200, encrypt.jsonObject(req.payload));
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');

module.exports.userPUT = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;
        User.findByIdAndUpdate(req.payload._id, data, {'new': true}, function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!post)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: "post's not founded"
                });
            var results = {
                success: true,
                message: 'Update post successful!',
                data: post
            }

            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
        })
    });
};







