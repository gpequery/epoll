const ElectionFactory = artifacts.require("ElectionFactory");
const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const MSG_missingElection = "Election inconnu.";
const MSG_missingCandidate = "Candidat inconnu.";
const MSG_deleteCandidate = "Candidat supprimé.";
const MSG_hasAlreadyVoted = "A déjà voté.";
const MSG_hasVoted = "A voté.";
const MSG_Ok = "Ok.";
const MSG_NotOwner = "Vous n'êtes pas le propriétaire de cette éléction.";
const MSG_wrongPeriod = "Ce n'est pas le bon moment.";

contract("ElectionFactory", accounts => {

    it("should succeed to create an election", () => {
        let electionName = "Election_1";
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;

        return ElectionFactory.deployed().then (async factory => {
            await factory.createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();

            return await factory.getElectionById(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(web3.utils.toUtf8(result[2]), electionName, "The election name sould be the good one");

        });
    });
});

contract("ElectionFactory", accounts => {
    it("should get empty election list", () => {

        return ElectionFactory.deployed().then (async factory => {
            return await factory.getElectionsList();
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(result[2].length, 0, "The list should be empty");
        });
    });

    it("should create 4 elections, delete one and return 3 in a list", () => {
        let electionName = "Election_1";
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;

        return ElectionFactory.deployed().then (async factory => {
            await factory.createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_2", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_3", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_4", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();
            await factory.deleteElectionById(electionList[2][0]);

            return await factory.getElectionsList();
        }).then ( result =>{

            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(result[2].length, 3, "The list should have 3 elections");
        });
    });

    it("should get election by id", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();
            return await  factory.getElectionById(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(web3.utils.toUtf8(result[2]), "Election_2", "The election name should be 'Election_2'");
        });
    });

    it("should not get unknown election by id", () => {
        return ElectionFactory.deployed().then (async factory => {
            return await  factory.getElectionById(88);
        }).then ( result =>{
            assert.equal(result[0], false, "The state should be false");
            assert.equal(result[1], MSG_missingElection, "The response should be : " +MSG_missingElection);
        });
    });

    it("should get periods from election by id", () => {
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;

        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();
            return await  factory.getElectionPeriodById(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1],"Ok.", "The response should be OK");
            assert.equal(result[2],startCandidateDate,  "Should return the candidate start Date");
            assert.equal(result[3],endCandidateDate,  "Should return the candidate end Date");
            assert.equal(result[4],startVoteDate,  "Should return the period start Date");
            assert.equal(result[5],endVoteDate,  "Should return the period end Date");
        });
    });

    it("should not get unknown election period by id", () => {
        return ElectionFactory.deployed().then (async factory => {
            return await  factory.getElectionPeriodById(88);
        }).then ( result =>{
            assert.equal(result[0], false, "The state should be false");
            assert.equal(result[1], MSG_missingElection, "The response should be : " +MSG_missingElection);
        });
    });

    it("should add candidate", () => {
        return ElectionFactory.deployed().then (async factory => {
            return await  factory.addOrUpdateCandidate(88);
        }).then ( result =>{
            assert.equal(result[0], false, "The state should be false");
            assert.equal(result[1], MSG_missingElection, "The response should be : " +MSG_missingElection);
        });
    });

});

// function testShouldAddCandidate() public {
//        var (a1, b1) = addOrUpdateCandidate(electionId, bytes32("John"), candidateName, bytes32("Who will have to wash the dish"), bytes32("wwwwwwww"));
//        Assert.equal(a1, true, "Should return true");
//        Assert.equal(b1, "Ok.", "Should have added the candidate");
//    }