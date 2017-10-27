var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');
var CryptoJS = require('crypto-js');
var encrypt = require('../helpers/lib/encryptAPI')

var Settings = mongoose.model('Settings');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.settingPOST = function (req, res) {
    var data = req.body;

    var setting = new Settings(data);
    setting.save(function (err, setting) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var results = {
            success: true,
            data: setting
        }
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(results), constant.SECRET_KEY);
        return sendJSONResponse(res, HTTPStatus.CREATED, encrypt.jsonObject(results))
    });
};

//  GET all Settings
module.exports.settingGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const name = req.query.name;
    delete req.query.name;

    if (id)
        query = {
            "_id": {$in: id}
        };
    else if (name) {
        query = {
            "name": {$in: name}
        }
    }
    else
        query = {};
    Settings.paginate(
        query,
        {
            sort: req.query.sort,
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, setting) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: setting.docs,
                total: setting.total,
                limit: setting.limit,
                page: setting.page,
                pages: setting.pages
            };
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(results), constant.SECRET_KEY);

            return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results));
        }
    )
};

//  Setting Get One
module.exports.settingGetOne = function (req, res) {
    Settings.findById(req.params.id, function (err, setting) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            })
        if (!setting)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: 'Setting not Founded'
            })
        var results = {
            success: true,
            data: setting
        }
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(results), constant.SECRET_KEY);

        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
    })
};

//  Setting PUT
module.exports.settingPUT = function (req, res) {
    var data = req.body;

    Settings.findByIdAndUpdate(req.params.id, data, {new: true}, function (err, setting) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err,
            })
        if (!setting)
            return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                success: false,
                message: err
            })
        var results = {
            success: true,
            message: 'Update successful!!',
            data: setting
        }
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(results), constant.SECRET_KEY);

        return sendJSONResponse(res, HTTPStatus.OK, encrypt.jsonObject(results))
    })
};