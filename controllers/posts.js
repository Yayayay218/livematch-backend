var mongoose = require('mongoose');
var apn = require('apn');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Posts = mongoose.model('Posts');
var Notifications = mongoose.model('Notifications');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var pushNotification = function (name, image, type, token) {
    var apnProvider = new apn.Provider(constant.DEV_OPTS);
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "default";
    // note.alert = "\uD83D\uDCE7 \u2709 " + data.alert;
    if (type === 0)
        note.title = 'Full match replay of ' + name + ' is now available. Watch it now!';
    else
        note.title = 'A video highlights of ' + name + ' is now available. Watch it now!';
    note.body = image;
    console.log(note);
    token.forEach(function (token) {
        apnProvider.send(note, token).then(function (result) {

            console.log("sent:", result.sent.length);
            console.log("failed:", result.failed.length);
            console.log(result.failed);
        });
    });

    apnProvider.shutdown();
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

var getListTokens = function (id, status) {
    return new Promise(function (resolve, reject) {
        var token = [];
        Notifications.find({
            match: id,
            status: status
        }, function (err, data) {
            if (err)
                reject(err);
            else {
                data.forEach(function (noti) {
                    token.push(noti.token)
                });
                resolve(token);
            }
        });

    })
};
//  POST a post
module.exports.newPost = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;

        var post = new Posts(data);
        post.save(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new post successful!",
                data: post
            })
        })
    });
};

module.exports.newFullMatch = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        req.body.type = 0;
        var data = req.body;

        var post = new Posts(data);
        post.save(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            getListTokens(post.match, 1).then(function (data) {
                console.log(data);
                pushNotification(post.name, post.coverPhoto, 0, data);
            }).catch(function (err) {
                sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                })
            });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new post successful!",
                data: post
            })
        })
    });
};

module.exports.newHighlight = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        req.body.type = 1;
        var data = req.body;

        var post = new Posts(data);
        post.save(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            getListTokens(post.match, 2).then(function (data) {
                console.log(data);
                pushNotification(post.name, post.coverPhoto, 1, data);
            }).catch(function (err) {
                sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                })
            });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new post successful!",
                data: post
            })
        })
    });
};

//  GET all Posts
module.exports.postGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const match = req.query.match;
    delete req.query.match;
    const type = req.query.type;
    delete req.query.type;
    const status = req.query.status;
    delete req.query.status;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (match)
        query = {
            "match": {$in: match}
        };
    else if (type)
        query = {
            "type": {$in: type}
        };
    else if (status)
        query = {
            "status": {$in: status}
        }
    else
        query = {};
    Posts.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'match',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: post.docs,
                total: post.total,
                limit: post.limit,
                page: post.page,
                pages: post.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.postGetOne = function (req, res) {
    Posts.findById(req.params.id)
        .populate('match')
        .exec(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!post)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: 'post not founded'
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: false,
                data: post
            })
        })
};
//  PUT a post
module.exports.postPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;
        Posts.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, post) {
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

//  DEL a post
module.exports.postDEL = function (req, res) {
    if (req.params.id)
        Posts.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'post was deleted'
            })
        });
};