var passport = require('passport');
var mongoose = require('mongoose');
var HTTPStatus = require('../helpers/lib/http_status');
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
            res.status(200);
            res.json({
                "token": 'Bearer ' + token
            });
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
            res.status(HTTPStatus.OK);
            return res.json({success: true, token: 'Bearer ' + token});
        }
    });
}

module.exports.userGETInfo = function (req, res) {
    sendJSONResponse(res, 200, req.payload);
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
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Update post successful!',
                data: post
            })
        })
    });
};







