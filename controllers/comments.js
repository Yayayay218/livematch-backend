var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var _ = require('lodash');
var async = require('async');
var CryptoJS = require('crypto-js')

var encrypt = require('../helpers/lib/encryptAPI')
var Comments = mongoose.model('Comments');
var Matches = mongoose.model('Matches');
var Votes = mongoose.model('Votes');
var Reports = mongoose.model('Reports')

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var sumVote = function (comment, user) {
    return new Promise(function (resolve, reject) {
        Votes.aggregate([
            {
                $match:
                    {
                        comment: mongoose.Types.ObjectId(comment)
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
            }], function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result)
        })
    })
}

var sumReport = function (comment, user) {
    return new Promise(function (resolve, reject) {
        Reports.aggregate([
            {
                $match:
                    {
                        comment: mongoose.Types.ObjectId(comment)
                    }
            },
            {
                $addFields: {
                    isReport: {$eq: ['$user', mongoose.Types.ObjectId(user)]},
                }
            },
            {
                $group: {
                    _id: null,
                    isReport: {$push: '$isReport'},
                    total: {$sum: "$status"}
                }
            }], function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result)
        })
    })
}

//  POST a comment
module.exports.commentPOST = function (req, res) {
    req.body.createdAt = new Date();
    req.body.user = req.payload._id;
    var data = req.body;

    var comment = new Comments(data);
    comment.save(function (err, comment) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
        var results = {
            success: true,
            data: comment
        }
        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
    })
};

//  GET all Comments
module.exports.commentGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    var sort = req.query.sort || '-createdAt';
    delete req.query.sort;
    var match = req.query.match;
    delete req.query.match;

    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (match)
        query = {
            "match": {$in: match}
        };
    else
        query = {};
    var userId = '59f046feace52e03554a47b9';
    if (req.query.userId)
        userId = req.query.userId;
    else
        userId = '59f046feace52e03554a47b9';
    Comments.paginate(
        query,
        {
            populate: 'user',
            sort: sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            lean: true
        }, function (err, comment) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var tmp = [];
            async.each(comment.docs, function (data, callback) {
                sumVote(data._id, userId).then(function (votes) {
                    var newComment = [];
                    if (!votes[0])
                        newComment = _.assign(data, {votes: 0});
                    else
                        newComment = _.assign(data, {votes: votes[0].total, isVote: votes[0].isVote});
                    tmp.push(newComment);
                    callback();
                })
            }, function (err) {
                if (err) {
                    var results = {
                        data: comment.docs,
                        total: comment.total,
                        limit: comment.limit,
                        page: comment.page,
                        pages: comment.pages,
                    };
                    return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
                }
                else {
                    var tmpReport = [];
                    async.each(tmp, function (data, callback) {
                        sumReport(data._id, userId).then(function (reports) {
                            var newComment = [];
                            if (!reports[0])
                                newComment = _.assign(data, {reports: 0});
                            else
                                newComment = _.assign(data, {reports: reports[0].total, isReport: reports[0].isReport});
                            tmpReport.push(newComment);
                            callback();
                        })
                    }, function (err) {
                        if (err)
                            console.log(err)
                        else {
                            comment.docs = tmpReport;
                            var results = {
                                data: comment.docs,
                                total: comment.total,
                                limit: comment.limit,
                                page: comment.page,
                                pages: comment.pages,
                            };

                            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
                        }
                    })
                }
            })
        }
    )
};

module.exports.commentGetOne = function (req, res) {
    Comments.findById(req.params.id, function (err, comment) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!comment)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: 'comment not founded'
            });
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            data: comment
        })
    })
};

//  DEL a commentz
module.exports.commentDEL = function (req, res) {
    if (req.params.id)
        Comments.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'comment was deleted'
            })
        });
};

//  PUT a comment
module.exports.commentPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    var data = req.body;
    Comments.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, comment) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        if (!comment)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: "comment's not founded"
            });
        var results = {
            success: true,
            data: comment
        }
        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
    });
};