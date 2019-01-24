const Web3 = require('web3');
const fs = require("fs");
const path = require('path');

let web3;
let contractAddress = '0x04ee09e859ecfb9efd169b0b16a2e86860623263';

module.exports = class ElectionFactory {
    constructor() {
        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        }

        // Récupération des informations du contrat
        let filePath = path.join('..', 'Truffle', 'build', 'contracts', 'ElectionFactory.json');
        let fileParsed = JSON.parse(fs.readFileSync(filePath));
        let abi = fileParsed.abi;

        // Création du contrat en spécifiant l'adresse de deploiement
        this.deployedContract = new this.web3.eth.Contract(abi, contractAddress);
    }



    createElection(userAccount, name, candidatureStart, candidatureEnd, voteStart, voteEnd) {
        try {
                let account = userAccount;
                let candidatureStartTime = new Date(candidatureStart);
                let candidatureEndTime = new Date(candidatureEnd);
                let voteStartTime = new Date(voteStart);
                let voteEndTime = new Date(voteEnd);
                return this.deployedContract.methods.createElection(name, candidatureStartTime.getTime(), candidatureEndTime.getTime(), voteStartTime.getTime(), voteEndTime.getTime())
                    .send({from: account, gas: 3000000})
                    .then(id => {
                        if (!id) {
                            return Promise.reject(null);
                        }
                        return Promise.resolve(id);
                    }).catch(error => {
                        console.error(error);
                    });
        } catch (error) {
            console.error(error);
        }
    }

    getElectionList() {
        try {
            return this.deployedContract.methods.getElectionsList().call().then(function (results) {
                if (!results) {
                    return Promise.reject(null);
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    getElectionById(id) {
        try {
            return this.deployedContract.methods.getElectionById(id).call().then(function (results) {
                if (!results) {
                    return Promise.reject('Election Not found');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    deleteElectionById(userAccount, id) {
        let account = userAccount;

        try {
            return this.deployedContract.methods.deleteElectionById(id).send({from: account, gas: 3000000}).then(function (results) {
                if (!results) {
                    return Promise.reject('Election Not found');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    addOrUpdateCandidate(userAccount, electionId, firstName, lastName, description, pictureUrl) {
        let account = userAccount;
        try {
            return this.deployedContract.methods.addOrUpdateCandidate(electionId, firstName, lastName, description, pictureUrl).send({
                from: account,
                gas: 3000000
            }).then(function (results) {
                if (!results) {
                    return Promise.reject('Candidate Not Created');
                }
                return Promise.resolve(results);
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    getCandidateList(electionId) {
        try {
            return this.deployedContract.methods.getCandidateList(electionId).call().then(function(results){
                if(!results){
                    return Promise.reject("Election Not Found");
                }
                return Promise.resolve(results);
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    getCandidateById(electionId, candidateId) {
        try {
            return this.deployedContract.methods.getCandidateById(electionId, candidateId).call().then(function (results) {
                if (!results) {
                    return Promise.reject('Candidate Not found');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    deleteCandidateById(userAccount, electionId) {
        let account = userAccount;

        try {
            return this.deployedContract.methods.deleteCandidate(electionId).send({from: account, gas: 3000000}).then(function (results) {
                if (!results) {
                    return Promise.reject('Candidate Not found');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    voteInAnElection(electionId, voterName, voterAge, candidateId) {
        let account = this.web3.eth.defaultAccount;

        try {
            return this.deployedContract.methods.voteInAnElection(electionId, voterName, voterAge, candidateId).send({from: account, gas: 3000000}).then(function (results) {
                if (!results) {
                    return Promise.reject('Vote error');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    getElectionWinner(electionId) {
        try {
            return this.deployedContract.methods.getElectionWinner(electionId).call().then(function (results) {
                if (!results) {
                    return Promise.reject('Result error');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }

    getCandidateNbVotersById(electionId, candidateId) {
        try {
            return this.deployedContract.methods.getCandidateNbVotersById(electionId, candidateId).call().then(function (results) {
                if (!results) {
                    return Promise.reject('Result error');
                }
                return Promise.resolve(results);
            });
        } catch (error) {
            console.error(error);
        }
    }
}
