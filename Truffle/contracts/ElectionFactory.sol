pragma solidity ^0.4.23;

import "./ownable.sol";

contract ElectionFactory is Ownable{

    event NewElection(uint electionId, bytes32 name);
    event DeleteElection(uint electionId, bytes32 name);

    event UpdateCandidate(uint electionId, address candidateId, bytes32 firstName, bytes32 lastName);
    event DeleteCandidate(uint electionId, address candidateId, bytes32 firstName, bytes32 lastName);


    constructor() public {
        owner = msg.sender;
    }

    struct Candidate {
        address id;
        bytes32 firstName;
        bytes32 lastName;
        bytes32 description;
        bytes32 pictureUrl;
        uint nbVoters;
        uint score;
        bool isValid;
        bool isDelete;
    }

    struct Voter {
        address id;
        bytes32 name;
        uint age;
        bool isValid;
    }

    struct Period {
        uint start;
        uint end;
    }

    struct Election {
        uint id;
        bytes32 name;
        Period candidaturePeriod;
        Period votePeriod;
        mapping (address => Candidate) candidates;
        address[] candidatesKeys;
        mapping (address => Voter) voters;
        address[] votersKeys;
        bool isValid;
        bool isDeleted;
        address owner;
    }

    mapping (uint => Election) public elections;
    uint[] public electionsKeys;
    string private MSG_missingElection = "Election inconnu.";
    string private MSG_missingCandidate = "Candidat inconnu.";
    string private MSG_deleteCandidate = "Candidat supprimé.";
    string private MSG_hasAlreadyVoted = "A déjà voté.";
    string private MSG_hasVoted = "A voté.";
    string private MSG_Ok = "Ok.";
    string private MSG_NotOwner = "Vous n'êtes pas le propriétaire de cette éléction.";
    string private MSG_wrongPeriod = "Ce n'est pas le bon moment.";

    //Créer une élection
    function createElection(bytes32 _name, uint _candidatureStart, uint _candidatureEnd, uint _voteStart, uint _voteEnd) public returns (bool state, string message, uint id) {

        uint electionId = _generateRandom(_name);
        Period memory candidaturePeriod = Period(_candidatureStart, _candidatureEnd);
        Period memory votePeriod = Period(_voteStart, _voteEnd);

        address[] memory candidatesKeys = new address[](0);
        address[] memory votersKeys = new address[](0);

        Election memory election = Election(electionId, _name, candidaturePeriod, votePeriod, candidatesKeys, votersKeys, true, false, msg.sender);
        elections[electionId] = election;
        electionsKeys.push(electionId);

        emit NewElection(electionId, _name);
        return (true, MSG_Ok, electionId);
    }

    //Renvoi la liste des élections valides
    function getElectionsList() public view returns (bool state, string message,  uint[] ids) {
        uint[] memory tmpResult = new uint[](electionsKeys.length);
        uint count = 0;

        for (uint i=0; i<electionsKeys.length; i++) {
            uint currentId = electionsKeys[i];
            Election memory election = elections[currentId];
            if(election.isValid){
                tmpResult[count] = currentId;
                count++;
            }
        }
        uint[] memory result = new uint[](count);
        for (uint j=0; j<count; j++) {
                result[j] = tmpResult[j];
        }

    return (true, MSG_Ok, result);
    }

    //Renvoi une election par ID
    function getElectionById(uint _id) public view returns (bool state, string message, bytes32 name, bool isValid, bool isDeleted) {
        Election memory election = elections[_id];
        if(election.isValid){
            return (true, MSG_Ok, election.name, election.isValid, election.isDeleted) ;
        }
        return (false, MSG_missingElection, "0", false, false) ;
    }

    function getElectionPeriodById(uint _id) public view returns (bool state, string message, uint candidaturePeriodStart, uint candidaturePeriodEnd,  uint votePeriodStart, uint votePeriodEnd) {
        Election memory election = elections[_id];
        if(election.isValid){
            return (true, MSG_Ok, election.candidaturePeriod.start, election.candidaturePeriod.end, election.votePeriod.start, election.votePeriod.end) ;
        }
        return (false, MSG_missingElection, 0, 0, 0, 0) ;
    }

    //Supprime une élection
    //Seul le propriétaire ou le createur du contrat peuvent supprimer
    function deleteElectionById(uint _id) public returns (bool state, string message) {
        Election storage election = elections[_id];

    if(election.isValid){
            if(election.owner == msg.sender || owner == msg.sender ){
                election.isDeleted = true;
                election.isValid = false;
                emit DeleteElection(_id, election.name);

                return (true, MSG_Ok);
            }
            return (false, MSG_NotOwner);
        }
        return (false, MSG_missingElection);
    }

    //Ajoute ou modifie les informations d'un candidat
    function addOrUpdateCandidate(uint _electionId, bytes32 _firstName, bytes32 _lastName, bytes32 _description, bytes32 _pictureUrl) public returns (bool, string) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Period memory candidaturePeriod =  election.candidaturePeriod;
            uint currentTime = now;
            if(currentTime >= candidaturePeriod.start && currentTime < candidaturePeriod.end){
                Candidate storage existCandidate = election.candidates[msg.sender];
                if(existCandidate.isValid && existCandidate.id == msg.sender){
                    existCandidate.firstName = _firstName;
                    existCandidate.lastName = _lastName;
                    existCandidate.description = _description;
                    existCandidate.pictureUrl = _pictureUrl;
                } else {
                    Candidate memory candidate = Candidate(msg.sender, _firstName, _lastName, _description, _pictureUrl, 0, 0, true, false);
                    election.candidates[msg.sender] = candidate;
                    election.candidatesKeys.push(msg.sender);
                }
                emit UpdateCandidate(_electionId, msg.sender, _firstName, _lastName);
                return (true, MSG_Ok);
            }
            return (false, MSG_wrongPeriod);
        }
        return (false, MSG_missingElection);
    }

    //Renvoi la liste des candidats d'une election
    function getCandidateList(uint _electionId) public view returns ( bool, string, address[]) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            address[] storage candidatesKeys = election.candidatesKeys;
            address[] memory result = new address[](candidatesKeys.length);
            uint count = 0;

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
    function getCandidateById(uint _electionId, address _candidateId) public view returns (bool, string, bytes32, bytes32, bytes32, bytes32, bool, bool) {
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
    function deleteCandidate(uint _electionId) public returns (bool, string) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            Candidate storage candidate = election.candidates[msg.sender];

            if(candidate.id == msg.sender){
                candidate.isValid = false;
                candidate.isDelete = true;
                emit DeleteCandidate(_electionId, msg.sender, candidate.firstName, candidate.lastName);
                return (true, MSG_deleteCandidate);
            }
        }
        return (false, MSG_missingElection);
    }

    //Voter à une élection
    //Prise en compte de 3 votes maximum avec un nombre de point décroissnat
    function voteInAnElection(uint _electionId, bytes32 _name, uint _age, address[] _candidatesId) public returns (bool, string) {

    Election storage election = elections[_electionId];
        if(election.isValid){
            Period memory votePeriod =  election.votePeriod;
            uint currentTime = now;
            if(currentTime >= votePeriod.start && currentTime < votePeriod.end){
                Voter memory voter = election.voters[msg.sender];
                if(voter.isValid){
                    return (false, MSG_hasAlreadyVoted);
                }
                voter = Voter(msg.sender, _name, _age, true);

                election.voters[msg.sender] = voter;
                election.votersKeys.push(msg.sender);

                for(uint i = 0; i < election.candidatesKeys.length; i++){
                    Candidate storage candidate = election.candidates[_candidatesId[i]];
                    if(candidate.isValid){
                        candidate.nbVoters++;
                        candidate.score += 3 - (i*1);
                    }
                }
                return (true, MSG_hasVoted);
            }
            return (false, MSG_wrongPeriod);
        }
        return (false, MSG_missingElection);
    }

    //Retourne les résultats d'une élection
    function getElectionWinner(uint _electionId) public view returns (bool, string, address[]){
        //TODO On vérifie que la période de vote est terminée
    Election storage election = elections[_electionId];
        if(election.isValid){
            address[] memory candidatesKeys = election.candidatesKeys;
            address[] memory winnerIds = new address[](candidatesKeys.length);
            uint maxResult = 0;
            uint winnerIdsCount = 0;

            for (uint i=0; i<candidatesKeys.length; i++) {
                address currentId = candidatesKeys[i];
                Candidate memory candidate = election.candidates[currentId];
                if(candidate.isValid){

                        if(maxResult < candidate.score){
                            maxResult = candidate.score;
                            winnerIds = new address[](candidatesKeys.length);
                            winnerIdsCount = 0;
                            winnerIds[winnerIdsCount] = candidate.id;
                        } else if(maxResult == candidate.score){
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
    function getCandidateNbVotersById(uint _electionId, address _candidateId) public view returns (bool, string, uint) {
        //TODO On vérifie que la période de vote est terminée
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
    function _generateRandom(bytes32 _str) private view returns (uint) {
        uint random = uint(keccak256(abi.encodePacked(_str,block.timestamp)));
        return random;
    }


}