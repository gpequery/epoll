const express = require('express');
let router = express.Router();

let electionClass = require('../Contracts/ElectionContract');
let electionContract = new electionClass();

/* GET users listing. */
router.post('/create', function(req, res, next) {
    var label = req.body.label;

    electionContract.createElection(label, 10, 10, 10, 10).then( newId => {
        console.log('New ID : ' + newId);
    });
});

module.exports = router;
