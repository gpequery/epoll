const express = require('express');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

let router = express.Router();

let electionClass = require('../Contracts/ElectionContract');
let electionContract = new electionClass();

/* GET users listing. */
router.post('/create', function(req, res, next) {
    let userAccount = req.body.userAccount;
    let election_name = web3.utils.hexToBytes(web3.utils.utf8ToHex(req.body.election_name));

    let election_start_candidate_value= new Date(req.body.election_start_candidate).getTime().toString();
    let election_end_candidate_value = new Date(req.body.election_end_candidate).getTime().toString();
    let election_start_vote_value = new Date(req.body.election_start_vote).getTime().toString();
    let election_end_vote_value = new Date(req.body.election_end_vote).getTime().toString();

    let election_start_candidate = parseInt(election_start_candidate_value.substring(0, election_start_candidate_value.length-3));
    let election_end_candidate = parseInt(election_end_candidate_value.substring(0, election_end_candidate_value.length-3));
    let election_start_vote = parseInt(election_start_vote_value.substring(0, election_start_vote_value.length-3));
    let election_end_vote = parseInt(election_end_vote_value.substring(0, election_end_vote_value.length-3));

    console.log("debut : "+election_start_candidate);
    console.log("fin : "+election_end_candidate);
    console.log("debut1 : "+election_start_vote);
    console.log("fin1 : "+election_end_vote);


    electionContract.createElection(userAccount, election_name, election_start_candidate, election_end_candidate, election_start_vote, election_end_vote).then( results => {
        res.send(true);
    });
});

router.post('/deleteElectionById', function(req, res, next) {
    let election_id = req.body.election_id;
    let userAccount = req.body.userAccount;

    electionContract.deleteElectionById(userAccount, election_id).then(result => {
        res.send(result)
    });
});

router.post('/getById', function(req, res, next) {
    electionContract.getElectionById(req.body.id).then(result => {

        let election = JSON.parse(JSON.stringify(result));

        let election_start_candidate_value= election.candidaturePeriodStart.toString();
        let election_end_candidate_value = election.candidaturePeriodEnd.toString();
        let election_start_vote_value = election.votePeriodStart.toString();
        let election_end_vote_value = election.votePeriodEnd.toString();

        election.name = web3.utils.toUtf8(election.name);
        election.candidaturePeriodStart = parseInt(election_start_candidate_value+"000");
        election.candidaturePeriodEnd = parseInt(election_end_candidate_value+"000");
        election.votePeriodStart = parseInt(election_start_vote_value+"000");
        election.votePeriodEnd = parseInt(election_end_vote_value+"000");

        res.send(election);
    });
});

router.post('/addOrUpdateCandidate', function(req, res, next) {
    let election_id = req.body.election_id;
    let firstname = web3.utils.hexToBytes(web3.utils.utf8ToHex(req.body.firstname));
    let lastname = web3.utils.hexToBytes(web3.utils.utf8ToHex(req.body.lastname));
    let description = web3.utils.hexToBytes(web3.utils.utf8ToHex(req.body.description));
    let image = req.body.image;
    let userAccount = req.body.userAccount;

    electionContract.addOrUpdateCandidate(userAccount, election_id, firstname, lastname, description, image).then( result => {
        res.send(result);
    });
});

router.post('/getCandidateList', function(req, res, next) {
    electionContract.getCandidateList(req.body.election_id).then( results => {
        console.log("LIST : "+JSON.stringify(results));

        res.send(results);
    });
});

router.post('/getCandidateById', function(req, res, next) {
    if (req.body.election_id && req.body.candidate_id) {

        electionContract.getCandidateById(req.body.election_id, req.body.candidate_id).then(result => {
            let candidate = JSON.parse(JSON.stringify(result));
            candidate.firstName = web3.utils.toUtf8(candidate.firstName);
            candidate.lastName = web3.utils.toUtf8(candidate.lastName);
            candidate.description = web3.utils.toUtf8(candidate.description);

            res.send(candidate);
        });
    }
});

router.post('/deleteCandidateById', function(req, res, next) {
    let election_id = req.body.election_id;
    let userAccount = req.body.userAccount;
    console.log("ID : "+userAccount);
    electionContract.deleteCandidateById(userAccount, election_id).then(result => {
        res.send(result);
    });
});

router.post('/voteInAnElection', function(req, res, next) {
    let userAccount = req.body.userAccount;

    electionContract.voteInAnElection(req.body.election_id, userAccount, 25, [req.body.candidate_id]).then(result => {
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
    let userAccount = req.body.userAccount;

    electionContract.getCandidateNbVotersById(election_id, userAccount).then(result => {
        console.log('Le candidat a eu : ' + JSON.stringify(result));
    });
});

module.exports = router;
