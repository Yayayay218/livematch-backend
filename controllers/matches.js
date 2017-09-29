var mongoose = require('mongoose');
var apn = require('apn');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Matches = mongoose.model('Matches');
var Notifications = mongoose.model('Notifications');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var pushNotification = function (name, token) {
    var apnProvider = new apn.Provider(constant.DEV_OPTS);
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "default";
    // note.alert = "\uD83D\uDCE7 \u2709 " + data.alert;
    note.title = name + ' is now on live. Watch it now!';
    note.body = name + ' is now on live. Watch it now!';
    note.topic = 'com.astralerapps.livematchHD';

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

//  POST a match
module.exports.matchPOST = function (req, res) {
    var data = req.body;

    var match = new Matches(data);
    match.save(function (err, match) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        return sendJSONResponse(res, HTTPStatus.CREATED, {
            success: true,
            message: "Add a new match successful!",
            data: match
        })
    });
};

//  GET all Matches
module.exports.matchGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const status = req.query.status;
    delete req.query.status;
    var sort = req.query.sort || 'index';
    delete req.query.sort;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (status)
        query = {
            "status": {$in: status}
        }
    else
        query = {};
    Matches.paginate(
        query,
        {
            sort: sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, match) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: match.docs,
                total: match.total,
                limit: match.limit,
                page: match.page,
                pages: match.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.matchGetOne = function (req, res) {
    Matches.findById(req.params.id, function (err, match) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!match)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: 'match not founded'
            });
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            data: match
        })
    })
};

//  DEL a matchz
module.exports.matchDEL = function (req, res) {
    if (req.params.id)
        Matches.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'match was deleted'
            })
        });
};

//  PUT a match
module.exports.matchPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    var data = req.body;
    Matches.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, match) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!match)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: "match's not founded"
            });
        if (match.status == 3)
            getListTokens(match._id, 0).then(function (data) {
                pushNotification(match.name, data);
            }).catch(function (err) {
                console.log(err);
            });

        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            message: 'Update match successful!',
            data: match
        })
    });
};