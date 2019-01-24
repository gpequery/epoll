const ElectionFactory = artifacts.require("ElectionFactory");
const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let accountAddress = '0xf7c1ed51bf3145a92996ac62449e8ca9aa61fa2d';


const MSG_missingElection = "Election inconnu.";
const MSG_missingCandidate = "Candidat inconnu.";
const MSG_deleteCandidate = "Candidat supprimé.";
const MSG_hasAlreadyVoted = "A déjà voté.";
const MSG_hasVoted = "A voté.";
const MSG_Ok = "Ok.";
const MSG_NotOwner = "Vous n'êtes pas le propriétaire de cette éléction.";
const MSG_wrongPeriod = "Ce n'est pas le bon moment.";

//TEST election
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

    it("should succeed to create an election", () => {
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;

        return ElectionFactory.deployed().then (async factory => {
            await factory.createElection("Election_1", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();

            return await factory.getElectionById(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(web3.utils.toUtf8(result[2]), "Election_1", "The election name sould be the good one");

        });
    });

    it("should have created 5 elections, delete one and return 4 in a list", () => {
        let startCandidateDate = 1547774798;
        let endCandidateDate = 1548259355;
        let startVoteDate = 1548864155;
        let endVoteDate = 1549036955;

        return ElectionFactory.deployed().then (async factory => {
            await factory.createElection("Election_2", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_3", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_4", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            await factory.createElection("Election_5", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();
            await factory.deleteElectionById(electionList[2][0]);

            return await factory.getElectionsList();
        }).then ( result =>{

            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], "Ok.", "The response should be OK");
            assert.equal(result[2].length, 4, "The list should have 3 elections");
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
});

//TEST candidate
contract("ElectionFactory", accounts => {

    it("should add the first candidate of an election", () => {
        return ElectionFactory.deployed().then (async factory => {
            let startCandidateDate = 1546375339; //1/1/2019
            let endCandidateDate = 1549399339; //5/2/2019
            let startVoteDate = 1546375339; //1/1/2019
            let endVoteDate = 1546375339; //1/1/2019

            await factory.createElection("Election_1", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();

            await factory.addOrUpdateCandidate(electionList[2][0], "Nelson", "Mandela", "Être libre, ce n’est pas seulement se débarrasser de ses chaînes… C’est vivre de manière à respecter et renforcer la liberté des autres.", "https://upload.wikimedia.org/wikipedia/commons/1/14/Nelson_Mandela-2008_%28edit%29.jpg");

            return await factory.getCandidateList(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
            assert.equal(result[2].length, 1, "The number of candidates should be 1");
        });
    });

    it("should not add the same candidate twice", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();

            await factory.addOrUpdateCandidate(electionList[2][0], "Nelson", "Mandela", "Être libre, ce n’est pas seulement se débarrasser de ses chaînes… C’est vivre de manière à respecter et renforcer la liberté des autres.", "https://upload.wikimedia.org/wikipedia/commons/1/14/Nelson_Mandela-2008_%28edit%29.jpg");

            return await factory.getCandidateList(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
            assert.equal(result[2].length, 1, "The number of candidates should be 1");
        });
    });

    it("should delete candidate", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();

            await factory.deleteCandidate(electionList[2][0]);

            return await factory.getCandidateList(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
            assert.equal(result[2].length, 0, "The number of candidates should be 0");
        });
    });
});
contract("ElectionFactory", accounts => {

    it("should not add candidate before candidate period of an election", () => {
        return ElectionFactory.deployed().then (async factory => {
            let startCandidateDate = 1552678939; //15/3/2019
            let endCandidateDate = 1556053138; //5/4/2019
            let startVoteDate = 1552678939; //15/3/2019
            let endVoteDate = 1552678939; //15/3/2019

            await factory.createElection("Election_1", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();

            await factory.addOrUpdateCandidate(electionList[2][0], "Nelson", "Mandela", "Être libre, ce n’est pas seulement se débarrasser de ses chaînes… C’est vivre de manière à respecter et renforcer la liberté des autres.", "https://upload.wikimedia.org/wikipedia/commons/1/14/Nelson_Mandela-2008_%28edit%29.jpg");

            return await factory.getCandidateList(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
            assert.equal(result[2].length, 0, "The number of candidates should be 1");
        });
    });
});
contract("ElectionFactory", accounts => {

    it("should not add candidate after candidate period of an election", () => {
        return ElectionFactory.deployed().then (async factory => {
            let startCandidateDate = 1524517138; //23/4/2018
            let endCandidateDate = 1524776338; //26/4/2018
            let startVoteDate = 1524517138; //15/3/2019
            let endVoteDate = 1524517138; //15/3/2019

            await factory.createElection("Election_1", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);
            let electionList = await factory.getElectionsList();

            await factory.addOrUpdateCandidate(electionList[2][0], "Nelson", "Mandela", "Être libre, ce n’est pas seulement se débarrasser de ses chaînes… C’est vivre de manière à respecter et renforcer la liberté des autres.", "https://upload.wikimedia.org/wikipedia/commons/1/14/Nelson_Mandela-2008_%28edit%29.jpg");

            return await factory.getCandidateList(electionList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
            assert.equal(result[2].length, 0, "The number of candidates should be 1");
        });
    });
});
contract("ElectionFactory", accounts => {
    it("should not get candidate if not candidate", () => {
        return ElectionFactory.deployed().then (async factory => {
            let startCandidateDate = 1546375339; //1/1/2019
            let endCandidateDate = 1549399339; //5/2/2019
            let startVoteDate = 1546375339; //1/1/2019
            let endVoteDate = 1546375339; //1/1/2019
            await factory.createElection("Election_1", startCandidateDate, endCandidateDate, startVoteDate, endVoteDate);

            let electionList = await factory.getElectionsList();

            return await factory.getCandidateById(electionList[2][0], "0xe1009458C3DEFffBb97A778615820a81809Ffdb5");
        }).then ( result =>{
            assert.equal(result[0], false, "The state should be true");
            assert.equal(result[1], MSG_missingCandidate, "The response should be : " +MSG_missingCandidate);
        });
    });
    it("should get candidate by id", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();
            await factory.addOrUpdateCandidate(electionList[2][0], "Nelson", "Mandela", "Être libre, ce n’est pas seulement se débarrasser de ses chaînes… C’est vivre de manière à respecter et renforcer la liberté des autres.", "https://upload.wikimedia.org/wikipedia/commons/1/14/Nelson_Mandela-2008_%28edit%29.jpg");
            let candidateList =  await factory.getCandidateList(electionList[2][0]);

            return await factory.getCandidateById(electionList[2][0],  candidateList[2][0]);
        }).then ( result =>{
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " +MSG_Ok);
        });
    });
    it("should delete candidate", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();

            await factory.deleteCandidate(electionList[2][0]);

            return await factory.getCandidateById(electionList[2][0],  accountAddress);
        }).then ( async result => {

            assert.equal(result[0], false, "The state should be false");
            assert.equal(result[1], MSG_missingCandidate, "The response should be : " + MSG_missingCandidate);
        });
    });
    it("should delete election", () => {
        return ElectionFactory.deployed().then (async factory => {
            let electionList = await factory.getElectionsList();

            await factory.deleteElectionById(electionList[2][0]);

            return await factory.getElectionsList();
        }).then ( result => {
            assert.equal(result[0], true, "The state should be true");
            assert.equal(result[1], MSG_Ok, "The response should be : " + MSG_Ok);
            assert.equal(result[2].length, 0, "The number of elections should be 0");
        });
    });
});