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
        console.log('CreateElection Event : ' + JSON.stringify(results));
        res.send(true);
    });
});

router.post('/deleteElectionById', function(req, res, next) {
    let election_id = req.body.election_id;

    electionContract.deleteElectionById(election_id).then(result => {
        res.send(result)
    });
});


router.post('/getById', function(req, res, next) {
    electionContract.getElectionById(req.body.id).then(result => {
        let election = JSON.parse(JSON.stringify(result));

        res.send(election);
    });
});

router.post('/addOrUpdateCandidate', function(req, res, next) {
    let election_id = req.body.election_id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let description = req.body.description;
    let image = req.body.image;

    electionContract.addOrUpdateCandidate(election_id, firstname, lastname, description, image).then( result => {
        res.send(result);
    });
});

router.post('/getCandidateList', function(req, res, next) {
    electionContract.getCandidateList(req.body.election_id).then( results => {
        res.send(results);
    });
});

router.post('/getCandidateById', function(req, res, next) {
    electionContract.getCandidateById(req.body.election_id, req.body.candidate_id).then(result => {
        res.send(result);
    });
});

router.post('/deleteCandidateById', function(req, res, next) {
    electionContract.deleteCandidateById(req.body.election_id).then(result => {
        res.send(result);
    });
});

router.post('/voteInAnElection', function(req, res, next) {
    electionContract.voteInAnElection(req.body.election_id, "myName", 25, req.body.candidate_id).then(result => {
        res.send(result);
    });
});

router.post('/getElectionWinner', function(req, res, next) {
    electionContract.getElectionWinner(req.body.election_id).then(result => {
        res.send(result[2][0]);
    });
});

router.post('/getCandidateNbVotersById', function(req, res, next) {
    let election_id = req.body.id;
    electionContract.getCandidateNbVotersById(election_id, "0xe1009458C3DEFffBb97A778615820a81809Ffdb5").then(result => {
        console.log('Le candidat a eu : ' + JSON.stringify(result));
    });
});

module.exports = router;
