var express = require('express');
var router = express.Router();
var electionClass = new require('../Contracts/ElectionContract');

var electionContract = new electionClass();

/* GET users listing. */
router.post('/create', function(req, res, next) {
    var label = req.body.label;

    electionContract.createElection(label)
    .then( result => {
        console.log('Message : ' + result);
    });
});

module.exports = router;
