var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var _ = require('lodash');
var async = require('async');
var CryptoJS = require('crypto-js');

var encrypt = require('../helpers/lib/encryptAPI');

var Channels = mongoose.model('Channels');
var Matches = mongoose.model('Matches');
var Users = mongoose.model('Users');
var Votes = mongoose.model('Votes');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var checkVoteChannelExist = function (user, channel) {
    return new Promise(function (resolve, reject) {
        Votes.findOne({
            user: user,
            channel: channel,
        }, function (err, vote) {
            if (err)
                reject(err);
            if (!vote)
                reject(err);
            resolve(vote)
        })
    })
};

var sumVote = function (channel, user) {
    return new Promise(function (resolve, reject) {
        Votes.aggregate([
            {
                $match:
                    {
                        channel: mongoose.Types.ObjectId(channel)
                    }
            },
            {
                $addFields: {
                    isVote: {$eq: ['$user', mongoose.Types.ObjectId(user)]},
                }
            },
            {
                $group: {
                    _id: null,
                    isVote: {$push: '$isVote'},
                    total: {$sum: "$status"}
                }
            }
        ], function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result)
        })
    })
}
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
        var results = {
            success: true,
            data: channel
        }
        return sendJSONResponse(res, HTTPStatus.CREATED, encrypt.jsonObject(results))
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
    var userId = '59f046feace52e03554a47b9';
    if (req.query.userId)
        userId = req.query.userId;
    else
        userId = '59f046feace52e03554a47b9';
    if (id) {
        query = {
            "_id": {$in: id}
        };
    }
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
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            lean: true
        }, function (err, channel) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var tmp = [];
            async.each(channel.docs, function (data, callback) {
                sumVote(data._id, userId).then(function (votes) {
                    var newChannel = [];
                    if (!votes[0])
                        newChannel = _.assign(data, {votes: 0});
                    else {
                        newChannel = _.assign(data, {votes: votes[0].total, isVote: votes[0].isVote});
                    }
                    tmp.push(newChannel);
                    callback();
                })
            }, function (err) {
                if (err) {
                    var results = {
                        data: channel.docs,
                        total: channel.total,
                        limit: channel.limit,
                        page: channel.page,
                        pages: channel.pages,
                    };
                    return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
                }
                else {
                    channel.docs = tmp;
                    var results = {
                        data: channel.docs,
                        total: channel.total,
                        limit: channel.limit,
                        page: channel.page,
                        pages: channel.pages,
                    };

                    return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
                }
            })
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
        var results = {
            success: true,
            data: channel
        }
        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
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
        var results = {
            success: true,
            data: channel
        }
        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
    });
};