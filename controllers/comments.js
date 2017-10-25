var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var _ = require('lodash');
var async = require('async');

var Comments = mongoose.model('Comments');
var Matches = mongoose.model('Matches');
var Votes = mongoose.model('Votes');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var sumVote = function (comment) {
    return new Promise(function (resolve, reject) {
        Votes.aggregate([
            {
                $match:
                    {
                        comment: mongoose.Types.ObjectId(comment)
                    }
            },
            {
                $group: {
                    _id: null,
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
    req.body.user = req.payload._id;
    var data = req.body;

    var comment = new Comments(data);
    comment.save(function (err, comment) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err)
        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            message: 'OK',
            data: comment
        })
    })
};

//  GET all Comments
module.exports.commentGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    var sort = req.query.sort || '-_id';
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
    Comments.paginate(
        query,
        {
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
                sumVote(data._id).then(function (votes) {
                    var newComment =[];
                    if (!votes[0])
                        newComment = _.assign(data, {votes: 0});
                    else
                        newComment = _.assign(data, {votes: votes[0].total});
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
                    return sendJSONResponse(res, HTTPStatus.OK, results);
                }
                else {
                    comment.docs = tmp;
                    var results = {
                        data: comment.docs,
                        total: comment.total,
                        limit: comment.limit,
                        page: comment.page,
                        pages: comment.pages,
                    };
                    return sendJSONResponse(res, HTTPStatus.OK, results);
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

        return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            message: 'Update comment successful!',
            data: comment
        })
    });
};