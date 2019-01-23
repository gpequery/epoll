const ElectionFactory = artifacts.require("ElectionFactory");
const assert = require('assert');
// const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

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
            // assert.equal(result[2], web3.toAscii(electionName), "The election name sould be the good one");

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


});
