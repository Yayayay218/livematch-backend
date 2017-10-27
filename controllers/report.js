var mongoose = require('mongoose');
var apn = require('apn');

mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var encrypt = require('../helpers/lib/encryptAPI');

var Reports = mongoose.model('Reports');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


//  GET all Reports
module.exports.reportGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    var sort = req.query.sort || '-createdAt';
    delete req.query.sort;
    var user = req.payload._id;
    var comment = req.query.comment;
    delete req.query.comment;
    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (comment)
        query = {
            "comment": comment,
            "user": user
        };
    else
        query = {};
    Reports.paginate(
        query,
        {
            sort: sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, report) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: report.docs,
                total: report.total,
                limit: report.limit,
                page: report.page,
                pages: report.pages
            };

            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
        }
    )
};

var checkReportCommentExist = function (user, comment) {
    return new Promise(function (resolve, reject) {
        Reports.findOne({
            user: user,
            comment: comment,
        }, function (err, report) {
            if (err)
                reject(err);
            if (!report)
                reject(err);
            resolve(report)
        })
    })
};

module.exports.reportComment = function (req, res) {
    req.body.user = req.payload._id;
    req.body.comment = req.params.id;
    checkReportCommentExist(req.body.user, req.params.id).then(function (docs) {
        Reports.findByIdAndRemove(docs._id, function (err, report) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                success: true,
                message: 'Delete report successful!',
            }
            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
        })
    }).catch(function (err) {
        console.log(err);
        req.body.status = 1;
        var data = req.body;
        var report = new Reports(data);
        report.save(function (err, report) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, err);
            var results = {
                success: true,
                message: 'Update report successful!',
                data: report
            };
            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
        })
    })
};