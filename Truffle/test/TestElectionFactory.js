const ElectionFactory = artifacts.require("ElectionFactory");
const assert = require('assert');

contract("ElectionFactory", accounts => {

    it("should succeed to create an election", () => {
        let electionName = "Election_1";
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;
        let instance;

        return ElectionFactory.deployed().then (async factory => {
            await factory.createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();
            return electionList[2][0];
        }).then ( electionId =>{
            console.log(electionId);
            instance.getElectionById(electionId);

    });
    });


    //         .then(factory => {
    //             instance = factory;
    //             instance.createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate)
    //                 .then(()=>{
    //                     instance.getElectionsList().then(result => {
    //                         console.log("RESILE :" +result);
    //                         let listElection = result[2];
    //                         return result[2][0];
    //                         return instance.getElementById(listElection[0])
    //                     }).then()
    //             });
    //
    //         }) .then(result => {
    //             console.log(result);
    //             assert.equal(result[0], true, "The state should be true");
    //             assert.equal(result[1], "Ok.", "The response should be OK");
    //         });
    // });

    // it("should get empty election list", () => {
    //
    //     return ElectionFactory.deployed()
    //         .then(instance => {
    //             return instance.getElectionList();
    //         }) .then(result => {
    //             assert.equal(result[0], true, "The state should be true");
    //             assert.equal(result[1], "Ok.", "The response should be OK");
    //             assert.equal(result[2].length, 0, "The list should be empty");
    //
    //         });
    // });
    //
    // it("should get 3 elections in list", () => {
    //     let electionName = "Election_1";
    //     let startCandidateDate = 1547774798;
    //     let endCandidateDate = 1548259355;
    //     let startVoteDate = 1548864155;
    //     let endVoteDate = 1549036955;
    //     return ElectionFactory.deployed()
    //         .then(instance => {
    //             instance.createElection.call(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
    //             instance.createElection.call("Election_2", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
    //             instance.createElection.call("Election_3", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
    //             // let resultElection = instance.createElection.call("Election_4", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
    //             // instance.deleteElectionById(resultElection[2]);
    //
    //             return instance.getElectionsList.call();
    //         }) .then(result => {
    //             assert.equal(result[0], true, "The state should be true");
    //             assert.equal(result[1], "Ok.", "The response should be OK");
    //             assert.equal(result[2].length, 0, "The list should be empty");
    //         });
    // });

});

// function testGetElectionsList() public  {
//        var (x1, y1, z1) = getElectionsList();
//        Assert.equal(uint(z1.length), uint(1), "Should return 1 election");
//
//        Period memory candidaturePeriod = Period(125, 126);
//        Period memory votePeriod = Period(150, 180);
//
//        createElection("Election_2", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
//        var (x3, y3, z3) = createElection("Election_4", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
//
//        var (x2, y2, z2) = getElectionsList();
//        Assert.equal(uint(z2.length), uint(3), "Should return 4 elections");
//
//        deleteElectionById(z3);
//
//        var (x4, y4, z4) = getElectionsList();
//        Assert.equal(uint(z4.length), uint(2), "Should return 3 elections");
//    }