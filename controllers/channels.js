var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Channels = mongoose.model('Channels');
var Matches = mongoose.model('Matches');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
// var multer = require('multer');
//
// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/channel')
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
//     }
// });
// var upload = multer({
//     storage: storage
// }).single('file');

//  POST a channel
module.exports.channelPOST = function (req, res) {
    var data = req.body;

    var channel = new Channels(data);
    channel.save(function (err, channel) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        return sendJSONResponse(res, HTTPStatus.CREATED, {
            success: true,
            message: "Add a new channel successful!",
            data: channel
        })
    });
};

//  GET all Channels
module.exports.channelGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const match = req.query.match;
    delete req.query.match;
    const status = req.query.status;
    delete req.query.status;
    var search = req.query.q;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (match)
        query = {
            "match": {$in: match}
        };
    else if (search) {

        query = {
            $or: [{
                matchName: {
                    $regex: search,
                    $options: 'i'
                }
            }]
        }
    }
    else if (status)
        query = {
            "status": {$in: status}
        };
    else
        query = {};
    Channels.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'match',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, channel) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: channel.docs,
                total: channel.total,
                limit: channel.limit,
                page: channel.page,
                pages: channel.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};
module.exports.channelGetOne = function (req, res) {
    Channels.findById(req.params.id, function (err, channel) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!channel)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: 'channel not founded'
            });
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            data: channel
        })
    })
};

//  DEL a channelz
module.exports.channelDEL = function (req, res) {
    if (req.params.id)
        Channels.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'channel was deleted'
            })
        });
};

//  PUT a channel
module.exports.channelPUT = function (req, res) {
    req.body.updatedAt = Date.now();
    var data = req.body;

    Channels.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, channel) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!channel)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: "channel's not founded"
            });
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            message: 'Update channel successful!',
            data: channel
        })
    });
};