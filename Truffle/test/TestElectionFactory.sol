pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "../contracts/ElectionFactory.sol";

contract TestElectionFactory is ElectionFactory {
//    uint electionId;
//    address candidateId;
//
//    bytes32 electionName = bytes32("Election_1");
//    bytes32 candidateName = bytes32("Doe");
//
//    uint startCandidateDate = 1547774798;
//    uint endCandidateDate = 1548259355;
//    uint startVoteDate = 1548864155;
//    uint endVoteDate = 1549036955;
//
//
//    constructor() public {
//    }
//
//    function testCreateElection() public {
//        var (x, y, z) = createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
//        electionId = uint(z);
//        Assert.equal(x, true, "The state should be true");
//        Assert.equal(y, "Ok.", "The response should be OK");
//    }
//
//    function testGetElectionsList() public  {
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
//
//    function testGetElectionById() public {
//        var (a1, b1, c1, d1, e1) = getElectionById(electionId);
//        Assert.equal(a1, true, "Should return true");
//        Assert.equal(c1, electionName, "Should return the election name");
//
//        var (a10, b10, c10, d10, e10) = getElectionById(88);
//        Assert.equal(a10, false, "Should return false");
//        Assert.equal(b10, "Election inconnu.", "Should retuen error message 'Election inconnu.'");
//    }
//
//    function testGetElectionPeriodById() public {
//        var (f1, g1, h1, i1, j1, k1) = getElectionPeriodById(electionId);
//        Assert.equal(f1, true, "Should return true");
//        Assert.equal(h1, startCandidateDate, "Should return the candidate start Date");
//        Assert.equal(i1, endCandidateDate, "Should return the candidate end Date");
//        Assert.equal(j1, startVoteDate, "Should return the vote start Date");
//        Assert.equal(k1, endVoteDate, "Should return the vote end Date");
//
//        var (f10, g20, h30, i40, j50, k50) = getElectionPeriodById(88);
//        Assert.equal(f10, false, "Should return false");
//        Assert.equal(g20, "Election inconnu.", "Should return error message 'Election inconnu.'");
//    }
//
//    function testShouldAddCandidate() public {
//        var (a1, b1) = addOrUpdateCandidate(electionId, bytes32("John"), candidateName, bytes32("Who will have to wash the dish"), bytes32("wwwwwwww"));
//        Assert.equal(a1, true, "Should return true");
//        Assert.equal(b1, "Ok.", "Should have added the candidate");
//    }
//
////    function testShouldNotAddCandidateToUnknownElection() public {
////        var (a1, b1) = addOrUpdateCandidate(88, bytes32("John"), bytes32("Doe"), bytes32("Who will have to wash the dish"), bytes32("wwwwwwww"));
////        Assert.equal(a1, false, "Should return false");
////        Assert.equal(b1, "Election inconnu.", "Should return error message 'Election inconnu.'");
////    }
//
//    function testGetCandidateList() public {
//        var (x1, y1, z1) = getCandidateList(electionId);
//        candidateId = z1[0];
//        Assert.equal(uint(z1.length), 1, "Should return 1 candidate");
//    }
//
//    function beforeEach() {
//        var (x, y, z) = createElection(electionName, startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
//        electionId = uint(z);
//        addOrUpdateCandidate(electionId, bytes32("John"), candidateName, bytes32("Who will have to wash the dish"), bytes32("wwwwwwww"));
//    }
//
//    function testGetCandidateById() public {
////            var (a1, b1, c1) = getCandidateById(electionId, candidateId);
////            Assert.equal(a1, true, "Should return true");
////            Assert.equal(d1, candidateName, "Should return the candidate name");
////
//            var (a10, b10, c10) = getCandidateById(electionId,0xe1009458C3DEFffBb97A778615820a81809Ffdb5);
//            Assert.equal(a10, false, "Should return false");
//            Assert.equal(b10, "Candidat inconnu.", "Should return error message 'Candidat inconnu.'");
//    }
//
//    function testDeleteElectionById() public {
////        var (a1, b1) = deleteElectionById(electionId);
////        Assert.equal(a1, true, "Should return true");
////        Assert.equal(b1, "Ok.", "Should have delete the election");
////
////        var (a2, b2) = deleteElectionById(88);
////        Assert.equal(a2, false, "Should return false");
////        Assert.equal(b2, "Election inconnu.", "Should return error message 'Election inconnu.'");
//
////        var (a3, b3, c3, d3, e3) = getElectionById(electionId);
////        Assert.equal(a3, false, "Should return false");
////        Assert.equal(b3, "Election inconnu.", "Should have delete the election");
//    }
//
//
//
//
////
////    function testGetCandidateById() public {
////
////    }
////
////    function testDeleteCandidate() public {
////
////    }
////
////    function testVoteInAnElection() public {
////
////    }
////
////    function testGetElectionWinner() public {
////
////    }
////
////    function testGetCandidateNbVotersById() public {
////
////    }
//
    }
