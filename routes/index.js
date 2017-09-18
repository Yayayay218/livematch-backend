var express = require('express');
var router = express.Router();

var fileCtrl = require('../controllers/file.');
var matchCtrl = require('../controllers/matches');
var postCtrl = require('../controllers/posts');
var channelCtrl = require('../controllers/channels');
var notificationCtrl = require('../controllers/notifications');
var tokenCtrl = require('../controllers/tokens');

//  Token APIs
router.post('/tokens', tokenCtrl.tokenPOST);
router.get('/tokens', tokenCtrl.tokenGetAll);

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

//  FullMatch
router.post('/fullMatches', postCtrl.newFullMatch);
router.get('/fullMatches', postCtrl.postGetAll);
router.get('/fullMatches/:id', postCtrl.postGetOne);
router.put('/fullMatches/:id', postCtrl.postPUT);
router.delete('/fullMatches/:id', postCtrl.postDEL);

//  Highlight
router.post('/highlights', postCtrl.newHighlight);
router.get('/highlights', postCtrl.postGetAll);
router.get('/highlights/:id', postCtrl.postGetOne);
router.put('/highlights/:id', postCtrl.postPUT);
router.delete('/highlights/:id', postCtrl.postDEL);

//  Channel APIs
router.post('/channels', channelCtrl.channelPOST);
router.get('/channels', channelCtrl.channelGetAll);
router.get('/channels/:id', channelCtrl.channelGetOne);
router.put('/channels/:id', channelCtrl.channelPUT);
router.delete('/channels/:id', channelCtrl.channelDEL);

//  File API
router.post('/files', fileCtrl.uploadFile);

router.post('/notifications', notificationCtrl.pushNotification);
router.get('/notifications', notificationCtrl.notificationGetAll);
router.delete('/notifications', notificationCtrl.notificationDEL);

router.post('/customNotification', notificationCtrl.pushCustomNotification);

module.exports = router;
