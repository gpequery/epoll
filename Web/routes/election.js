const express = require('express');
let router = express.Router();

let electionClass = require('../Contracts/ElectionContract');
let electionContract = new electionClass();

/* GET users listing. */
router.post('/create', function(req, res, next) {
    let election_name = req.body.election_name;
    let election_start_candidate = req.body.election_start_candidate;
    let election_end_candidate = req.body.election_end_candidate;
    let election_start_vote = req.body.election_start_vote;
    let election_end_vote = req.body.election_end_vote;

    electionContract.createElection(election_name, election_start_candidate, election_end_candidate, election_start_vote, election_end_vote).then( newId => {
        var my_obj_str = JSON.stringify(newId);
        console.log('CreateElection : ' + my_obj_str);
    });
});

router.get('/list', function(req, res, next) {
    electionContract.getElectionList().then( results => {
        console.log('ElectionList : ' + results);
    });
});

module.exports = router;
