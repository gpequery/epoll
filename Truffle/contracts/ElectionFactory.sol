pragma solidity ^0.4.23;

import "./ownable.sol";

contract ElectionFactory is Ownable{

    event NewElection(uint256 electionId, bytes32 name);
    event DeleteElection(uint256 electionId, bytes32 name);

    event UpdateCandidate(uint256 electionId, address candidateId, bytes32 firstName, bytes32 lastName);
    event DeleteCandidate(uint256 electionId, address candidateId, bytes32 firstName, bytes32 lastName);


    constructor() public {
        owner = msg.sender;
    }

    struct Candidate {
        address id;
        bytes32 firstName;
        bytes32 lastName;
        bytes32 description;
        string pictureUrl;
        uint256 nbVoters;
        uint256 score;
        bool isValid;
        bool isDelete;
    }

    struct Voter {
        address id;
        bytes32 name;
        uint256 age;
        bool isValid;
    }

    struct Period {
        uint256 start;
        uint256 end;
    }

    struct Election {
        uint256 id;
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

    mapping (uint256 => Election) public elections;
    uint256[] public electionsKeys;
    string private MSG_missingElection = "Election inconnu.";
    string private MSG_missingCandidate = "Candidat inconnu.";
    string private MSG_deleteCandidate = "Candidat supprimé.";
    string private MSG_isAlreadyCandidate = "Est déjà candidat";

    string private MSG_hasAlreadyVoted = "A déjà voté.";
    string private MSG_hasVoted = "A voté.";
    string private MSG_Ok = "Ok.";
    string private MSG_NotOwner = "Vous n'êtes pas le propriétaire de cette éléction.";
    string private MSG_wrongPeriod = "Période incompatible.";

    //Créer une élection
    function createElection(bytes32 _name, uint256 _candidatureStart, uint256 _candidatureEnd, uint256 _voteStart, uint256 _voteEnd) public returns (bool state, string message, uint256 id) {

        uint256 electionId = _generateRandom(_name);
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
    function getElectionsList() public view returns (bool state, string message,  uint256[] ids) {
        uint256[] memory tmpResult = new uint256[](electionsKeys.length);
        uint256 count = 0;

        for (uint256 i=0; i<electionsKeys.length; i++) {
            uint256 currentId = electionsKeys[i];
            Election memory election = elections[currentId];
            if(election.isValid){
                tmpResult[count] = currentId;
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 j=0; j<count; j++) {
                result[j] = tmpResult[j];
        }

    return (true, MSG_Ok, result);
    }

    //Renvoi une election par ID
    function getElectionById(uint256 _id) public view returns (bool state, string message, bytes32 name, uint candidaturePeriodStart, uint candidaturePeriodEnd,  uint votePeriodStart, uint votePeriodEnd, bool isValid, bool isDeleted) {
        Election memory election = elections[_id];
        if(election.isValid){
            return (true, MSG_Ok, election.name, election.candidaturePeriod.start, election.candidaturePeriod.end, election.votePeriod.start, election.votePeriod.end, election.isValid, election.isDeleted) ;
        }
        return (false, MSG_missingElection, "0", 0, 0, 0, 0, false, false) ;
    }

    function getElectionPeriodById(uint256 _id) public view returns (bool state, string message, uint256 candidaturePeriodStart, uint256 candidaturePeriodEnd,  uint256 votePeriodStart, uint256 votePeriodEnd) {
        Election memory election = elections[_id];
        if(election.isValid){
            return (true, MSG_Ok, election.candidaturePeriod.start, election.candidaturePeriod.end, election.votePeriod.start, election.votePeriod.end) ;
        }
        return (false, MSG_missingElection, 0, 0, 0, 0) ;
    }

    //Supprime une élection
    //Seul le propriétaire ou le createur du contrat peuvent supprimer
    function deleteElectionById(uint256 _id) public returns (bool state, string message) {
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
    function addOrUpdateCandidate(uint256 _electionId, bytes32 _firstName, bytes32 _lastName, bytes32 _description, string _pictureUrl) public returns (bool state, string message) {
        Election storage election = elections[_electionId];
        if(election.isValid){
            if(now >= election.candidaturePeriod.start && now < election.candidaturePeriod.end){
                Candidate memory candidate = election.candidates[msg.sender];
                    if(!candidate.isValid){
                        Candidate memory newCandidate = Candidate(msg.sender, _firstName, _lastName, _description, _pictureUrl, 0, 0, true, false);
                        election.candidates[msg.sender] = newCandidate;
                        election.candidatesKeys.push(msg.sender);
                        emit UpdateCandidate(_electionId, msg.sender, _firstName, _lastName);
                        return (true, MSG_Ok);
                    }
                return (false, MSG_isAlreadyCandidate);
            }
            return (false, MSG_wrongPeriod);
        }
        return (false, MSG_missingElection);
    }

    //Renvoi la liste des candidats d'une election
    function getCandidateList(uint256 _electionId) public view returns ( bool state, string message, address[] addresses) {
        Election storage election = elections[_electionId];
        address[] memory tmpResult = new address[](0);

        if(election.isValid){
            address[] storage candidatesKeys = election.candidatesKeys;
            tmpResult = new address[](candidatesKeys.length);
            uint256 count = 0;

            for (uint256 i=0; i<candidatesKeys.length; i++) {
                address currentId = candidatesKeys[i];
                Candidate memory candidate = election.candidates[currentId];
                if(candidate.isValid){
                    tmpResult[count] = currentId;
                    count++;
                }
            }
            address[] memory result = new address[](count);
            for (uint256 j=0; j<count; j++) {
                result[j] = tmpResult[j];
            }
            return (true, MSG_Ok, result);
        }
        return (false, MSG_missingElection, result) ;
    }

    //Renvoi un candidat par ID
    function getCandidateById(uint256 _electionId, address _candidateId) public view returns (bool state, string message, bytes32 firstName, bytes32 lastName, bytes32 description, string pictureUrl, bool isValid, bool isDelete) {
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
    function deleteCandidate(uint256 _electionId) public returns (bool state, string message) {
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
    function voteInAnElection(uint256 _electionId, bytes32 _name, uint256 _age, address[] _candidatesId) public returns (bool state, string message) {

    Election storage election = elections[_electionId];
        if(election.isValid){
            Period memory votePeriod =  election.votePeriod;
            uint256 currentTime = now;
            if(currentTime >= votePeriod.start && currentTime < votePeriod.end){
                Voter memory voter = election.voters[msg.sender];
                if(voter.isValid){
                    return (false, MSG_hasAlreadyVoted);
                }
                voter = Voter(msg.sender, _name, _age, true);

                election.voters[msg.sender] = voter;
                election.votersKeys.push(msg.sender);

                for(uint256 i = 0; i < election.candidatesKeys.length; i++){
                    Candidate storage candidate = election.candidates[_candidatesId[i]];
                    if(candidate.isValid){
                        candidate.nbVoters++;
                        candidate.score = uint256(candidate.score + (3 - (i*1)));
                    }
                }
                return (true, MSG_hasVoted);
            }
            return (false, MSG_wrongPeriod);
        }
        return (false, MSG_missingElection);
    }

    //Retourne les résultats d'une élection
    function getElectionWinner(uint256 _electionId) public view returns (bool state, string message, address[] addresses){
    Election storage election = elections[_electionId];
        if(election.isValid){
            address[] memory candidatesKeys = election.candidatesKeys;
            address[] memory winnerIds = new address[](candidatesKeys.length);
            uint256 maxResult = 0;
            uint256 winnerIdsCount = 0;

            for (uint256 i=0; i<candidatesKeys.length; i++) {
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
    function getCandidateNbVotersById(uint256 _electionId, address _candidateId) public view returns (bool state, string message, uint256 nbVotes) {
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
    function _generateRandom(bytes32 _str) private view returns (uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(_str,block.timestamp)));
        return random;
    }


}