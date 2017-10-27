var CryptoJS = require('crypto-js');
var constant = require('../lib/constant');

module.exports.jsonObject = function (data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), constant.SECRET_KEY).toString();
    // return data;
}

module.exports.stringObject = function (data) {
    return CryptoJS.AES.encrypt(data, constant.SECRET_KEY).toString();
    // return data;
}