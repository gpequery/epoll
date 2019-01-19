pragma solidity ^0.4.23;

import "./ownable.sol";

contract ElectionFactory is Ownable{

    event NewElection(uint8 electionId, string name);
    event DeleteElection(uint8 electionId, string name);

    event UpdateCandidate(uint8 electionId, address candidateId, string firstName, string lastName);
    event DeleteCandidate(uint8 electionId, address candidateId, string firstName, string lastName);


    constructor() public {}

    struct Candidate {
        address id;
        string firstName;
        string lastName;
        string description;
        string pictureUrl;
        uint8 nbVoters;
        bool isValid;
        bool isDelete;
    }

    struct Voter {
        address id;
        string name;
        uint age;
        bool isValid;
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
        mapping (address => Candidate) candidates;
        address[] candidatesKeys;
        mapping (address => Voter) voters;
        address[] votersKeys;
        bool isValid;
        bool isDeleted;
    }

    mapping (uint8 => Election) public elections;
    uint8[] public electionsKeys;
    string private MSG_missingElection = "Election inconnu.";
    string private MSG_missingCandidate = "Candidat inconnu.";
    string private MSG_deleteCandidate = "Candidat supprimé.";
    string private MSG_hasAlreadyVoted = "A déjà voté.";
    string private MSG_hasVoted = "A voté.";
    string private MSG_Ok = "Ok.";

    //Créer une élection
    function createElection(string _name, uint _candidatureStart, uint _candidatureEnd, uint _voteStart, uint _voteEnd) public returns (bool state, string message, uint8 id) {

        uint8 electionId = _generateRandom(_name);
        Period memory candidaturePeriod = Period(_candidatureStart, _candidatureEnd);
        Period memory votePeriod = Period(_voteStart, _voteEnd);

        address[] memory candidatesKeys = new address[](1);
        candidatesKeys[0] = 0;

        address[] memory votersKeys = new address[](1);
        votersKeys[0] = 0;

        Election memory election = Election(electionId, _name, candidaturePeriod, votePeriod, candidatesKeys, votersKeys, true, false);
        elections[electionId] = election;
        electionsKeys.push(electionId);

        emit NewElection(electionId, _name);
        return (true, MSG_Ok, electionId);
    }

    //Renvoi la liste des élections valides
    function getElectionsList() public view returns (bool state, string message,  uint8[] ids) {
        uint8[] memory result = new uint8[](electionsKeys.length);
        uint8 count = 0;

        for (uint i=0; i<electionsKeys.length; i++) {
            uint8 currentId = electionsKeys[i];
            Election memory election = elections[currentId];
            if(election.isValid){
                result[count] = currentId;
                count++;
            }
        }
        return (true, MSG_Ok, result);
    }

    //Renvoi une election par ID
    function getElectionById(uint8 _id) public view returns (bool state, string message, string name, uint candidaturePeriodStart, uint candidaturePeriodEnd,  uint votePeriodStart, uint votePeriodEnd, bool isValid, bool isDeleted) {
        Election memory election = elections[_id];
        if(election.isValid){
            return (true, MSG_Ok, election.name, election.candidaturePeriod.start, election.candidaturePeriod.end, election.votePeriod.start, election.votePeriod.end, election.isValid, election.isDeleted) ;
        }
        return (false, MSG_missingElection, "0", 0, 0, 0, 0, false, false) ;
    }

    //Supprime une élection
    function deleteElectionById(uint8 _id) public returns (bool state, string message) {
        Election storage election = elections[_id];

        if(election.isValid){
            election.isDeleted = true;
            election.isValid = false;
            emit DeleteElection(_id, election.name);

        return (true, MSG_Ok);
        }
        return (false, MSG_missingElection);
    }

    //Ajoute ou modifie les informations d'un candidat
    function addOrUpdateCandidate(uint8 _electionId, address _candidateId, string _firstName, string _lastName, string _description, string _pictureUrl) public returns (bool, string) {
        Election storage election = elections[_electionId];

        if(election.isValid){
            Candidate storage existCandidate = election.candidates[_candidateId];
            if(existCandidate.isValid){
                existCandidate.firstName = _firstName;
                existCandidate.lastName = _lastName;
                existCandidate.description = _description;
                existCandidate.pictureUrl = _pictureUrl;
            } else {
                Candidate memory candidate = Candidate(_candidateId, _firstName, _lastName, _description, _pictureUrl, 0, true, false);
                election.candidates[_candidateId] = candidate;
                election.candidatesKeys.push(_candidateId);
            }
            emit UpdateCandidate(_electionId, _candidateId, _firstName, _lastName);
            return (true, MSG_Ok);
        }
        return (false, MSG_missingElection);
    }

    //Renvoi la liste des candidats d'une election
    function getCandidateList(uint8 _electionId) public view returns ( bool, string, address[]) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            address[] storage candidatesKeys = election.candidatesKeys;
            address[] memory result = new address[](candidatesKeys.length);
            uint8 count = 0;

            for (uint i=0; i<candidatesKeys.length; i++) {
                address currentId = candidatesKeys[i];
                Candidate memory candidate = election.candidates[currentId];
                if(candidate.isValid){
                    result[count] = currentId;
                    count++;
                }
            }
            return (true, MSG_Ok, result);
        }
        return (false, MSG_missingElection, result) ;
    }

    //Renvoi un candidat par ID
    function getCandidateById(uint8 _electionId, address _candidateId) public view returns (bool, string, string, string, string, string, bool, bool) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Candidate memory candidate = election.candidates[_candidateId];
            if(candidate.isValid){
                return (true, MSG_Ok, candidate.firstName, candidate.lastName, candidate.description, candidate.pictureUrl, candidate.isValid, candidate.isDelete) ;
            }
            return (false, MSG_missingCandidate, "0", "0", "0", "0", false, false) ;
        }
        return (false, MSG_missingElection, "0", "0", "0", "0", false, false) ;
    }

    //Supprimer un candidat
    function deleteCandidate(uint8 _electionId, address _candidateId) public returns (bool, string) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Candidate storage candidate = election.candidates[_candidateId];
            candidate.isValid = false;
            candidate.isDelete = true;
            emit DeleteCandidate(_electionId, _candidateId, candidate.firstName, candidate.lastName);
            return (true, MSG_deleteCandidate);
        }
        return (false, MSG_missingElection);
    }

    //Voter à une élection
    function voteInAnElection(uint8 _electionId, address _voterId, string _name, uint8 _age, address _candidateId) public returns (bool, string) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Candidate storage candidate = election.candidates[_candidateId];
            if(candidate.isValid){
                Voter memory voter = election.voters[_voterId];
                if(voter.isValid){
                    return (false, MSG_hasAlreadyVoted);
                }
                voter = Voter(_voterId, _name, _age, true);

                election.voters[_voterId] = voter;
                election.votersKeys.push(_voterId);
                candidate.nbVoters++;
                return (true, MSG_hasVoted);
            }
            return (false, MSG_missingCandidate);
        }
        return (false, MSG_missingElection);
    }

    //Retourne les résultats d'une élection
    function getElectionWinner(uint8 _electionId) public view returns (bool, string, address[]){
        Election storage election = elections[_electionId];
        if(election.isValid){
            address[] memory candidatesKeys = election.candidatesKeys;
            address[] memory winnerIds = new address[](candidatesKeys.length);
            uint8 maxResult = 0;
            uint8 winnerIdsCount = 0;

            for (uint i=0; i<candidatesKeys.length; i++) {
                address currentId = candidatesKeys[i];
                Candidate memory candidate = election.candidates[currentId];
                if(candidate.isValid){

                        if(maxResult < candidate.nbVoters){
                            maxResult = candidate.nbVoters;
                            winnerIds = new address[](candidatesKeys.length);
                            winnerIdsCount = 0;
                            winnerIds[winnerIdsCount] = candidate.id;
                        } else if(maxResult == candidate.nbVoters){
                            winnerIds[winnerIdsCount] = candidate.id;
                            winnerIdsCount++;
                        }
                }
            }
            return (true, MSG_Ok, winnerIds);
        }
        return (false, MSG_missingElection, winnerIds);
    }

    //Renvoi le nombre de vote par candidat ID
    function getCandidateNbVotersById(uint8 _electionId, address _candidateId) public view returns (bool, string, uint8) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Candidate memory candidate = election.candidates[_candidateId];
            if(candidate.isValid){
                return (true, MSG_Ok, candidate.nbVoters) ;
            }
            return (false, MSG_missingCandidate, 0) ;
        }
        return (false, MSG_missingElection,0) ;
    }

    //UTILS
    function _generateRandom(string _str) private view returns (uint8) {
        uint8 random = uint8(keccak256(abi.encodePacked(_str,block.timestamp)));
        return random;
    }


}