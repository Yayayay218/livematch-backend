var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Tokens = mongoose.model('Tokens');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.tokenPOST = function (req, res) {
    var data = req.body;

    var token = new Tokens(data);
    token.save(function (err, token) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        return sendJSONResponse(res, HTTPStatus.CREATED, {
            success: true,
            message: "Add a new token successful!",
            data: token
        })
    });
};

//  GET all Tokens
module.exports.tokenGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;

    if (id)
        query = {
            "_id": {$in: id}
        };
    else
        query = {};
    Tokens.paginate(
        query,
        {
            sort: req.query.sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, token) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: token.docs,
                total: token.total,
                limit: token.limit,
                page: token.page,
                pages: token.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};