const express = require('express');
const router = express.Router();

let electionClass = require('../Contracts/ElectionContract');
let electionContract = new electionClass();


/* GET home page. */
router.get('/', function(req, res, next) {
    electionContract.getElectionList().then( result => {
        let results = JSON.parse(JSON.stringify(result));

        results.ids = results.ids.filter(function(value, index, arr){
            return value !== '0';
        });

        res.render('index', {electionsIds: results.ids});
    });
});

module.exports = router;
