pragma solidity ^0.4.23;

contract ElectionFactory {

    constructor() public {}

    struct Candidate {
        string id;
        string firstName;
        string lastName;
        string description;
        string PictureUrl;
        bool isValid;
    }

    struct Voter {
        string name;
        uint age;
        string adr;
    }

    struct Period {
        uint start;
        uint end;
    }

    struct Election {
        uint8 id;
        string name;
        Period candidaturePeriod;
        Period votePeriod;
        mapping (string => Candidate) candidates;
        string[] candidatesKeys;
        bool isValid;
        bool isDeleted;
    }

    mapping (uint8 => Election) public elections;
    uint8[] public electionsKeys;

    //Election
    function createElection(string _name, uint candidatureStart, uint candidatureEnd, uint voteStart, uint voteEnd) public returns (uint8) {

        uint8 createId = _generateRandom(_name);
        Period memory candidaturePeriod = Period(candidatureStart, candidatureEnd);
        Period memory votePeriod = Period(voteStart, voteEnd);

        string[] memory candidatesKeys = new string[](1);
        candidatesKeys[0] = "0";

        Election memory election = Election(createId, _name, candidaturePeriod, votePeriod, candidatesKeys, true, false);

        elections[createId] = election;
        electionsKeys.push(createId);

        return createId;
    }

    function getElectionsList() public view returns ( uint8[]) {
        uint8[] memory result = new uint8[](electionsKeys.length);
        uint8 count = 0;

        for (uint i=0; i<electionsKeys.length; i++) {
            uint8 currentId = electionsKeys[i];
            Election memory election = elections[currentId];
            if(!election.isDeleted){
                result[count] = currentId;
                count++;
            }
        }
        return result;
    }

    function getElectionById(uint8 id) public view returns (bool, string name, uint candidatureStart, uint candidatureEnd,  uint voteStart, uint voteEnd, bool isValid, bool isDeleted) {
        Election memory election = elections[id];
        if(election.isValid && !election.isDeleted){
            return (true, election.name, election.candidaturePeriod.start, election.candidaturePeriod.end, election.votePeriod.start, election.votePeriod.end, election.isValid, election.isDeleted) ;
        }
        return (false, "0", 0, 0, 0, 0, false, false) ;
    }

    function deleteElectionById(uint8 _id) public returns (bool) {
       Election storage election = elections[_id];

       if(election.isValid){
           election.isDeleted = true;
           return true;
        }

        return false;
    }

    //Candidate//TODO
    function addOrUpdateCandidate(uint8 electionId, string id, string firstName, string lastName, string description, string PictureUrl) public returns (bool) {
        Election storage election = elections[electionId];

        if(election.isValid){
            Candidate memory checkCandidate = election.candidates[id];
            if(checkCandidate.isValid){
                delete election.candidates[id];
            }
            Candidate memory candidate = Candidate(id, firstName, lastName, description, PictureUrl, true);
            election.candidates[id] = candidate;
            return true;
        }
        return false;
    }

    function deleteCandidate() public pure returns (bool) {//TODO
        return true ;
    }

    //Voter à une élection
    function voteInAnElection() pure public {//TODO
    }

    //Retourner la liste des candidats à une élection
    function getCandidateList() pure public {//TODO
    }

    //Retourne les résultats d'une élection
    function getElectionResult() pure public {//TODO
    }

    //UTILS

    function _generateRandom(string _str) private view returns (uint8) {
        uint8 random = uint8(keccak256(abi.encodePacked(_str,block.timestamp)));
        return random;
    }


}