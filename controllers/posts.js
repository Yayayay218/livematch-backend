var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Posts = mongoose.model('Posts');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  Config upload photo
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({
    storage: storage
}).single('file');

//  POST a post
module.exports.newPost = function (req, res) {
    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;

        var post = new Posts(data);
        post.save(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: "Add a new post successful!",
                data: post
            })
        })
    });
};

//  GET all Posts
module.exports.postGetAll = function (req, res) {
    var query = req.query || {};
    const id = req.query.id;
    delete req.query.id;
    const match = req.query.match;
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
    Posts.paginate(
        query,
        {
            sort: req.query.sort,
            populate: 'match',
            page: Number(req.query.page),
            limit: Number(req.query.limit)
        }, function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            var results = {
                data: post.docs,
                total: post.total,
                limit: post.limit,
                page: post.page,
                pages: post.pages
            };
            return sendJSONResponse(res, HTTPStatus.OK, results);
        }
    )
};

module.exports.postGetOne = function (req, res) {
    Posts.findById(req.params.id)
        .populate('match')
        .exec(function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!post)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: 'post not founded'
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: false,
                data: post
            })
        })
};
//  PUT a post
module.exports.postPUT = function (req, res) {
    req.body.updatedAt = Date.now();

    upload(req, res, function (err) {
        if (err)
            return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
            });
        var data = req.body;
        Posts.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, post) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                });
            if (!post)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: "post's not founded"
                });
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Update post successful!',
                data: post
            })
        })
    });
};

//  DEL a post
module.exports.postDEL = function (req, res) {
    if (req.params.id)
        Posts.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return sendJSONResponse(res, HTTPStatus.NOT_FOUND, {
                    success: false,
                    message: err
                });
            return sendJSONResponse(res, HTTPStatus.NO_CONTENT, {
                success: true,
                message: 'post was deleted'
            })
        });
};