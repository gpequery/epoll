pragma solidity ^0.4.23;

contract PollFactory {
    struct Participant {
        string name;
        uint age;
    }

    struct Election {
        uint id;
        string name;
        Period candidaturePeriod;
        Period votePeriod;
    }

    Participant[] private participants;
    Election[] private elections;
    uint myVariable;

    struct Period {
        uint start;
        uint end;
    }

    constructor() public {

    }

    function createElection(string _name, uint candidatureStart, uint candidatureEnd, uint voteStart, uint voteEnd) public returns (uint) {
        Period memory candidaturePeriod = Period(candidatureStart, candidatureEnd);
        Period memory votePeriod = Period(voteStart, voteEnd);
        uint id = _generateRandom(_name);

        Election memory election = Election(id, _name, candidaturePeriod, votePeriod);

        elections.push(election);
        myVariable = id;

        return id;
    }

    function _generateRandom(string _str) private pure returns (uint) {
        uint random = uint(keccak256(abi.encodePacked(_str)));
        return random;
    }

    //Se présenter à une élection
    function standForElection() pure public {

    }

    //Voter à une élection
    function voteInAnElection() pure public {

    }

    //Retourner la liste des candidats à une élection
    function getCandidateList() pure public {

    }

    //Retourne la liste des élections
    function getElectionsList() public view returns (uint[]) {
        uint[] memory ids = new uint[](elections.length);
        uint counter = 0;
        for(uint i = 0; i < elections.length; i++){
            ids[counter] = elections[i].id;
            counter++;
        }
        return ids;
    }

    //Retourne les résultats d'une élection
    function getElectionResult() pure public {

    }

    function createparticipant(string _name, uint _age) internal returns (uint) {
        uint id = participants.push(Participant(_name, _age)) - 1;

        return id;
    }

    function getMessage() public pure returns (string) {
        return "Hello world";
    }

}
