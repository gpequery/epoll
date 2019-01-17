const Web3 = require('web3');
const fs = require("fs");
const path = require('path');

let web3;
let accountAddress = '0x494929143e4ffab62c91d7faa9e084a7132110ad';
let contractAddress = '0x92af673988a6162513e1d5507204c21cfec80f66';

module.exports = class ElectionFactory {

    constructor() {

        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            //Clé public de l'utilisateur par default
            this.web3.eth.accounts[0] = accountAddress;
        }
        //Liste les comptes possédant du crédit
        // web3.eth.getAccounts(console.log);

        //Compte associé aux transactions par default
        this.web3.eth.defaultAccount = this.web3.eth.accounts[0];

        // Récupération des informations du contrat
        let filePath = path.join('..', 'Truffle', 'build', 'contracts', 'ElectionFactory.json');
        let fileParsed = JSON.parse(fs.readFileSync(filePath));
        let abi = fileParsed.abi;

        // Création du contrat en spécifiant l'adresse de deploiement
        this.deployedContract = new this.web3.eth.Contract(abi, contractAddress);
    }

    createElection(name, candidatureStart, candidatureEnd, voteStart, voteEnd) {
        let account = this.web3.eth.defaultAccount;

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

    deleteElectionById(id) {
        let account = web3.eth.defaultAccount;

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

    // getElectionsSize() {
    //     return this.deployedContract
    //     .then(deployedContract => {
    //         return deployedContract.getElectionsSize();
    //     }).then(size => {
    //         return Promise.resolve(size);
    //     }).catch(error => {
    //         console.error(error);
    //     });
    // }
}
