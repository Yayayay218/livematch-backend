var constant = require('../helpers/lib/constant')
var encrypt = require('../helpers/lib/encryptAPI')
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/media')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');
var photos = multer({storage: storage}).array('photos', 5);


exports.uploadFile = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log("error:" + err);
            sendJSONresponse(res, 400, {message: 'fail'});
        }
        if (!req.file) {
            sendJSONresponse(res, 404, {message: 'fail'})
        }
        var url = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        console.log(url);

        sendJSONresponse(res, 200, encrypt.stringObject(url));
    })
};

exports.uploadPhotos = function (req, res) {
    photos(req, res, function (err) {
        if (err) {
            console.log("error:" + err);
            sendJSONresponse(res, 400, {message: 'fail'});
        }
        if (!req.file) {
            sendJSONresponse(res, 404, {message: 'fail'})
        }
        var url = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        console.log(url);
        sendJSONresponse(res, 200, url);
    })
};