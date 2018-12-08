var express = require('express');
var router = express.Router();
var pollClass = new require('../Contracts/PollContract');

var contract = require('truffle-contract');
var Web3 = require('web3');

var pollContract = new pollClass();

/* GET home page. */
router.get('/', function(req, res, next) {
    pollContract.getMessage()
    .then( message => {
        res.render('index', { data: message });
    }).catch( error => {
        res.render('index', { data: error });
    });
});

module.exports = router;
