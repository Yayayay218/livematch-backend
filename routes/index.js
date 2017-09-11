var express = require('express');
var router = express.Router();

var fileCtrl = require('../controllers/file.');
var matchCtrl = require('../controllers/matches');
var postCtrl = require('../controllers/posts');

//  Match APIs
router.post('/matches', matchCtrl.matchPOST);
router.get('/matches', matchCtrl.matchGetAll);
router.get('/matches/:id', matchCtrl.matchGetOne);
router.put('/matches/:id', matchCtrl.matchPUT);
router.delete('/matches/:id', matchCtrl.matchDEL);

//  Post APIs
router.post('/posts', postCtrl.newPost);
router.get('/posts', postCtrl.postGetAll);
router.get('/posts/:id', postCtrl.postGetAll);
router.put('/posts/:id', postCtrl.postPUT);
router.delete('/posts/:id', postCtrl.postDEL);

//  File API
router.post('/files', fileCtrl.uploadFile);

module.exports = router;
