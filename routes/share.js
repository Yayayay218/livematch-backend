var express = require('express');
var router = express.Router();

var matchCtrl = require('../controllers/matches');

router.get('/:id', matchCtrl.matchGetOne);

module.exports = router;
