const express = require('express');
const router = express.Router();

let electionClass = require('../Contracts/ElectionContract');
let electionContract = new electionClass();


/* GET home page. */
router.get('/', function(req, res, next) {
    electionContract.getElectionList().then( electionsIds => {
        res.render('index', {electionsIds: electionsIds});
    });
});

module.exports = router;
