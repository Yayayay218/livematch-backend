var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var fileCtrl = require('../controllers/file.');
var matchCtrl = require('../controllers/matches');
var postCtrl = require('../controllers/posts');
var channelCtrl = require('../controllers/channels');
var notificationCtrl = require('../controllers/notifications');
var tokenCtrl = require('../controllers/tokens');
var authCtrl = require('../controllers/auth');
var settingCtrl = require('../controllers/settings');
var commentCtrl = require('../controllers/comments');
var voteCtrl = require('../controllers/votes');
var reportCtrl = require('../controllers/report');

var passport = require('passport');

//  Auth
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

router.post('/auth/facebook',
    passport.authenticate('facebook-token'),
    authCtrl.loginSocial
);
router.post('/auth/twitter',
    passport.authenticate('twitter-token'),
    authCtrl.loginSocial
);

//  User
router.get('/me', auth, authCtrl.userGETInfo);
router.put('/me', auth, authCtrl.userPUT);

//  Vote APIs
router.get('/votes', auth, voteCtrl.voteGetAll);
router.post('/channel/votes/up/:id', auth, voteCtrl.voteUpChannel);
router.post('/channel/votes/down/:id', auth, voteCtrl.voteDownChannel);
router.post('/comment/votes/up/:id', auth, voteCtrl.voteUpComment);
router.post('/comment/votes/down/:id', auth, voteCtrl.voteDownComment);

//  Comments APIs
router.post('/comments', auth, commentCtrl.commentPOST);
router.get('/comments', commentCtrl.commentGetAll);
router.post('/comment/report/:id', auth, reportCtrl.reportComment);

//  Token APIs
router.post('/tokens', auth, tokenCtrl.tokenPOST);
router.get('/tokens', tokenCtrl.tokenGetAll);

//  Match APIs
router.post('/matches', auth, matchCtrl.matchPOST);
router.get('/matches', matchCtrl.matchGetAll);
router.get('/matches/:id', matchCtrl.matchGetOne);
// router.get('matches/:slug', matchCtrl.matchGetSlug);
router.put('/matches/:id', auth, matchCtrl.matchPUT);
router.delete('/matches/:id', auth, matchCtrl.matchDEL);

//  Post APIs
router.post('/posts', auth, postCtrl.newPost);
router.get('/posts', postCtrl.postGetAllUnAuthorize);
router.get('/posts/:id', postCtrl.postGetOne);
router.put('/posts/:id', auth, postCtrl.postPUT);
router.delete('/posts/:id', auth, postCtrl.postDEL);

//  FullMatch
router.post('/fullMatches', auth, postCtrl.newFullMatch);
router.get('/fullMatches', auth, postCtrl.postGetAll);
router.get('/fullMatches/:id', auth, postCtrl.postGetOne);
router.put('/fullMatches/:id', auth, postCtrl.postPUT);
router.delete('/fullMatches/:id', auth, postCtrl.postDEL);

//  Highlight
router.post('/highlights', auth, postCtrl.newHighlight);
router.get('/highlights', auth, postCtrl.postGetAll);
router.get('/highlights/:id', auth, postCtrl.postGetOne);
router.put('/highlights/:id', auth, postCtrl.postPUT);
router.delete('/highlights/:id', auth, postCtrl.postDEL);

//  Channel APIs
router.post('/channels', auth, channelCtrl.channelPOST);
router.get('/channels', channelCtrl.channelGetAll);
router.get('/channels/:id', auth, channelCtrl.channelGetOne);
router.put('/channels/:id', auth, channelCtrl.channelPUT);
router.delete('/channels/:id', auth, channelCtrl.channelDEL);

//  File API
router.post('/files', fileCtrl.uploadFile);

router.post('/notifications', notificationCtrl.pushNotification);
router.get('/notifications', notificationCtrl.notificationGetAll);
router.delete('/notifications', notificationCtrl.notificationDEL);

router.post('/customNotification', notificationCtrl.pushCustomNotification);

//  Setting APIs
router.post('/settings', auth, settingCtrl.settingPOST);
router.get('/settings', settingCtrl.settingGetAll);
router.get('/settings/:id', settingCtrl.settingGetOne);
router.put('/settings/:id', auth, settingCtrl.settingPUT);

module.exports = router;
