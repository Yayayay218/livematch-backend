var mongoose = require('mongoose');
var apn = require('apn');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Tokens = mongoose.model('Tokens');
var Notifications = mongoose.model('Notifications');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

// module.exports.pushNotification = function (req, res) {
//     var data = req.body;
//     // if (process.env.NODE_ENV === 'production')
//     //     var apnProvider = new apn.Provider(cfgNotification.PRD_OPTS);
//     // else
//     var apnProvider = new apn.Provider(constant.DEV_OPTS);
//     let notification = 'da9439cdb782dd8eed71ea5bec5f4c199492eeb5a6b35ab9dfb1d0de3b6462d6';
//     Posts.findById(req.params.id)
//         .populate('match')
//         .exec(function (err, post) {
//             if (err)
//                 return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
//                     success: false,
//                     message: err
//                 });
//             if (!post)
//                 return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
//                     success: false,
//                     message: 'post not founded'
//                 });
//             // console.log(post);
//             var note = new apn.Notification();
//
//             note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
//             note.badge = 1;
//             note.sound = "default";
//             // note.alert = "\uD83D\uDCE7 \u2709 " + data.alert;
//             if (post.type === 0)
//                 note.title = 'Full match replay of ' + post.match.name + ' is now available. Watch it now!';
//             else
//                 note.title = 'A video highlights of ' + post.match.name + ' is now available. Watch it now!';
//             note.body = post.coverPhoto;
//             console.log(note);
//             apnProvider.send(note, notification).then(function (result) {
//
//                 console.log("sent:", result.sent.length);
//                 console.log("failed:", result.failed.length);
//                 console.log(result.failed);
//             });
//             sendJSONResponse(res, 200, 'OK');
//         });
//     apnProvider.shutdown();
// };

module.exports.pushNotification = function (req, res) {
    var data = req.body;

    var notification = new Notifications(data);
    notification.save(function (err, data) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        return sendJSONResponse(res, HTTPStatus.CREATED, {
            success: true,
            message: 'OK',
            data: data
        })
    });
};

module.exports.notificationGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const match = req.query.match;
    delete req.query.match;
    const token = req.query.token;
    delete req.query.token;

    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (match && token)
        query = {
            'match': match,
            'token': token
        };
    else
        query = {};
    Notifications.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'match',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, notification) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: notification.docs,
                total: notification.total,
                limit: notification.limit,
                page: notification.page,
                pages: notification.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.notificationDEL = function (req, res) {
    Notifications.find(
        {
            token: req.body.token,
            match: req.body.match,
            status: req.body.status
        }, function (err, data) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!data)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: 'Not Found'
                });
            Notifications.findByIdAndRemove(data[0]._id, function (err) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                console.log('OK')
                return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                    success: true,
                    message: 'OK'
                })
            })
        })
};

module.exports.pushCustomNotification = function (req, res) {
    var data = req.body;
    // if (process.env.NODE_ENV === 'production')
    //     var apnProvider = new apn.Provider(cfgNotification.PRD_OPTS);
    // else
    var apnProvider = new apn.Provider(constant.DEV_OPTS);
    Tokens.find(function (err, token) {
        if (err)
            sendJSONResponse(res, 500, {
                success: false,
                message: err
            })
        token.forEach((token) => {
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 1;
            note.sound = "default";
            // note.alert = "\uD83D\uDCE7 \u2709 " + data.alert;
            note.title = data.title;
            note.topic = 'com.astralerapps.livematchios'
            apnProvider.send(note, token.token).then(function (result) {
                // sendJSONResponse(res, 200, {
                //     sent: result.sent.length,
                //     failed: result.failed.length,
                //     fail: result.failed
                // })
                console.log("sent:", result.sent.length);
                console.log("failed:", result.failed.length);
                console.log(result.failed);
            });
        });
    });

    apnProvider.shutdown();
};