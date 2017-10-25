var mongoose = require('mongoose');
var apn = require('apn');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Votes = mongoose.model('Votes');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


//  GET all Votes
module.exports.voteGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    var sort = req.query.sort || '-createdAt';
    delete req.query.sort;
    var channel = req.query.channel;
    delete req.query.channel;
    var user = req.payload._id;
    var comment = req.query.comment;
    delete req.query.comment;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (channel)
        query = {
            "channel": channel,
            "user": user
        };
    else if (comment)
        query = {
            "comment": comment,
            "user": user
        };
    else
        query = {};
    Votes.paginate(
        query,
        {
            sort: sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, vote) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: vote.docs,
                total: vote.total,
                limit: vote.limit,
                page: vote.page,
                pages: vote.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
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

module.exports.voteUpChannel = function (req, res) {
    req.body.type = 0;
    req.body.user = req.payload._id;
    req.body.channel = req.params.id;
    checkVoteChannelExist(req.body.user, req.params.id).then(function (docs) {
        if (docs.status == -1) {
            req.body.status = 1;
            Votes.findByIdAndUpdate(docs._id, req.body, {'new': true}, function (err, vote) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                if (!vote)
                    return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                        success: false,
                        message: "vote's not founded"
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'Update vote successful!',
                    data: vote
                })
            })
        }
        else
            Votes.findByIdAndRemove(docs._id, function (err) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'OK',
                })
            })
    }).catch(function (err) {
        console.log(err);
        req.body.status = 1;
        var data = req.body;
        var vote = new Votes(data);
        vote.save(function (err, vote) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'OK',
                data: vote
            })
        })
    })

};

module.exports.voteDownChannel = function (req, res) {
    req.body.type = 0;
    req.body.user = req.payload._id;
    req.body.channel = req.params.id;
    checkVoteChannelExist(req.body.user, req.params.id).then(function (docs) {
        if (docs.status == 1) {
            req.body.status = -1;
            Votes.findByIdAndUpdate(docs._id, req.body, {'new': true}, function (err, vote) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                if (!vote)
                    return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                        success: false,
                        message: "vote's not founded"
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'Update vote successful!',
                    data: vote
                })
            })
        }
        else
            Votes.findByIdAndRemove(docs._id, function (err) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });

                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'OK',
                })
            })
    }).catch(function (err) {
        console.log(err);
        req.body.status = -1;
        var data = req.body;
        var vote = new Votes(data);
        vote.save(function (err, vote) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'OK',
                data: vote
            })
        })
    })
};

var checkVoteCommentExist = function (user, comment) {
    return new Promise(function (resolve, reject) {
        Votes.findOne({
            user: user,
            comment: comment,
        }, function (err, vote) {
            if (err)
                reject(err);
            if (!vote)
                reject(err);
            resolve(vote)
        })
    })
};

module.exports.voteUpComment = function (req, res) {
    req.body.type = 0;
    req.body.user = req.payload._id;
    req.body.comment = req.params.id;
    checkVoteCommentExist(req.body.user, req.params.id).then(function (docs) {
        if (docs.status == -1) {
            req.body.status = 1;
            Votes.findByIdAndUpdate(docs._id, req.body, {'new': true}, function (err, vote) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                if (!vote)
                    return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                        success: false,
                        message: "vote's not founded"
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'Update vote successful!',
                    data: vote
                })
            })
        }
        else
            Votes.findByIdAndRemove(docs._id, function (err) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'OK',
                })
            })
    }).catch(function (err) {
        console.log(err);
        req.body.status = 1;
        var data = req.body;
        var vote = new Votes(data);
        vote.save(function (err, vote) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'OK',
                data: vote
            })
        })
    })

};

module.exports.voteDownComment = function (req, res) {
    req.body.type = 0;
    req.body.user = req.payload._id;
    req.body.comment = req.params.id;
    checkVoteCommentExist(req.body.user, req.params.id).then(function (docs) {
        if (docs.status == 1) {
            req.body.status = -1;
            Votes.findByIdAndUpdate(docs._id, req.body, {'new': true}, function (err, vote) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });
                if (!vote)
                    return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                        success: false,
                        message: "vote's not founded"
                    });
                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'Update vote successful!',
                    data: vote
                })
            })
        }
        else
            Votes.findByIdAndRemove(docs._id, function (err) {
                if (err)
                    return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                        success: false,
                        message: err
                    });

                return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: 'OK',
                })
            })
    }).catch(function (err) {
        console.log(err);
        req.body.status = -1;
        var data = req.body;
        var vote = new Votes(data);
        vote.save(function (err, vote) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'OK',
                data: vote
            })
        })
    })
};
