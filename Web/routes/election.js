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

    electionContract.createElection(election_name, election_start_candidate, election_end_candidate, election_start_vote, election_end_vote).then( results => {
        let newId = JSON.parse(JSON.stringify(results));
        console.log("create "+newId);
        console.log('CreateElection ID : ' + newId.id);
    });
});

router.post('/getById', function(req, res, next) {
    electionContract.getElectionById(req.body.id).then(result => {
        let election = JSON.parse(JSON.stringify(result));

        res.send(election);
    });
});

router.post('/addOrUpdateCandidate', function(req, res, next) {
    console.log('addOrUpdateCandidate');
    let election_id = req.body.id;
    console.log('addOrUpdateCandidate'+election_id);

    electionContract.addOrUpdateCandidate(election_id, 1234, "Bob", "Eponge", "Patrick", "google").then( result => {
        console.log('addOrUpdateCandidate response');

        let my_obj_str = JSON.stringify(result);

        console.log('Create Candidate : ' + my_obj_str);
    });
});

router.post('/getCandidateList', function(req, res, next) {
    console.log('getCandidateList');
    let election_id = req.body.id;

    electionContract.getCandidateList(election_id).then( results => {
        console.log('CandidateList'+election_id+' : ' + JSON.stringify(results));
    });
});

router.post('/getCandidateById', function(req, res, next) {
    let election_id = req.body.id;

    electionContract.getCandidateById(election_id, 210).then(result => {
        let candidate = JSON.parse(JSON.stringify(result));
        console.log('Candidate 210: ' + JSON.stringify(result));

        res.send(candidate);
    });
});

router.post('/deleteCandidateById', function(req, res, next) {
    let election_id = req.body.id;

    electionContract.deleteCandidateById(election_id, 210).then(result => {
        console.log('Delete candidate 210: ' + JSON.stringify(result));
    });
});

router.post('/voteInAnElection', function(req, res, next) {
    let election_id = req.body.id;
    electionContract.voteInAnElection(election_id, 456, "Batman", 25, 210).then(result => {
        console.log('Vote de Batman : ' + JSON.stringify(result));
    });
});

router.post('/getElectionWinner', function(req, res, next) {
    let election_id = req.body.id;
    electionContract.getElectionWinner(election_id).then(result => {
        console.log('Le gagnant est : ' + JSON.stringify(result));
    });
});

router.post('/getCandidateNbVotersById', function(req, res, next) {
    let election_id = req.body.id;
    electionContract.getCandidateNbVotersById(election_id, 210).then(result => {
        console.log('Le candidat a eu : ' + JSON.stringify(result));
    });
});

module.exports = router;
