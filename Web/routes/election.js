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
        let transactionResult = JSON.parse(JSON.stringify(results));
        console.log('CreateElection Event : ' + JSON.stringify(transactionResult.events));
        res.send(true);
    });
});

router.post('/deleteElectionById', function(req, res, next) {
    let election_id = req.body.id;

    electionContract.deleteElectionById(election_id).then(result => {
        let transactionResult = JSON.parse(JSON.stringify(result));
        console.log('Delete election Event : ' + JSON.stringify(transactionResult.events));
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

    console.log('addOrUpdateCandidate : ' + election_id);
    console.log('firstname : ' + firstname);
    console.log('lastname : ' + lastname);
    console.log('description : ' + description);
    console.log('image : ' + image);

    electionContract.addOrUpdateCandidate(election_id, firstname, lastname, description, image).then( result => {
        console.log('addOrUpdateCandidate response');

        let transactionResult = JSON.parse(JSON.stringify(result));
        console.log('Create Candidate Event : ' + JSON.stringify(transactionResult.events));

        res.send(true);
    });
});

router.post('/getCandidateList', function(req, res, next) {
    let election_id = req.body.election_id;

    electionContract.getCandidateList(election_id).then( results => {
        console.log(JSON.stringify(results));
        res.send(results);
    });
});

router.post('/getCandidateById', function(req, res, next) {
    let election_id = req.body.election_id;
    let candidate_id = req.body.candidate_id;

    electionContract.getCandidateById(election_id, candidate_id).then(result => {
        let candidate = JSON.parse(JSON.stringify(result));
        console.log('Candidate 210: ' + JSON.stringify(result));

        res.send(candidate);
    });
});

router.post('/deleteCandidateById', function(req, res, next) {
    let election_id = req.body.id;

    electionContract.deleteCandidateById(election_id).then(result => {
        let transactionResult = JSON.parse(JSON.stringify(result));
        console.log('Delete candidate Event : ' + JSON.stringify(transactionResult.events));
    });
});

router.post('/voteInAnElection', function(req, res, next) {
    let election_id = req.body.id;
    electionContract.voteInAnElection(election_id, "Batman", 25, "0xe1009458C3DEFffBb97A778615820a81809Ffdb5").then(result => {
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
    electionContract.getCandidateNbVotersById(election_id, "0xe1009458C3DEFffBb97A778615820a81809Ffdb5").then(result => {
        console.log('Le candidat a eu : ' + JSON.stringify(result));
    });
});

module.exports = router;
