const Web3 = require('web3');
const fs = require("fs");
const path = require('path');


let web3;

module.exports = class ElectionFactory {

   constructor() {

       if (typeof web3 !== 'undefined') {
           web3 = new Web3(web3.currentProvider);
       } else {
           web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
           //Clé public de l'utilisateur par default
           web3.eth.accounts[0] = '0x12e2fdd528086c4cb31779d67570a8f494e8f97e';
           //Liste les comptes possédant du crédit
           // let accounts =  web3.eth.getAccounts();
           // web3.eth.accounts[0] = accounts[0];
       }
        console.log('ACCOUNT :' + web3.eth.accounts[0]);
       //Liste les comptes possédant du crédit
       web3.eth.getAccounts(console.log);

       //Compte associé aux transactions par default
       web3.eth.defaultAccount = web3.eth.accounts[0];

       // Récupération des informations du contrat
       let appDir = path.dirname(require.main.filename);
       let jsonFile = appDir.substring(0, appDir.length-7) + '\\Truffle\\build\\contracts\\ElectionFactory.json';
       let parsed= JSON.parse(fs.readFileSync(jsonFile));
       let abi = parsed.abi;

       // Création du contrat en spécifiant l'adresse de deploiement
       this.deployedContract = new web3.eth.Contract(abi, '0x0d1732f3113d5a2028c87690112e421bfcb24ccb');
   }



   createElection(name, candidatureStart, candidatureEnd, voteStart, voteEnd) {
       let account = web3.eth.defaultAccount;

       let candidatureStartTime = new Date(candidatureStart);
       let candidatureEndTime = new Date(candidatureEnd);
       let voteStartTime = new Date(voteStart);
       let voteEndTime = new Date(voteEnd);

       return this.deployedContract.methods.createElection(name,candidatureStartTime.getTime(),candidatureEndTime.getTime(),voteStartTime.getTime(),voteEndTime.getTime())
           .send({from: account, gas:3000000})
           .then(id => {
           if(!id){
               return Promise.reject(null);
           }
           return Promise.resolve(id);
           }).catch(error => {
               console.error(error);
           });
   }

    getElectionList() {
        try {
            return this.deployedContract.methods.getElectionsList().call().then(function(results){
                            if(!results){
                                return Promise.reject(null);
                            }
                            return Promise.resolve(results);
                        });
        }
        catch(error) {
            console.error(error);
        }
    }

   // getElection(id) {
   //     return this.deployedContract
   //     .then(deployedContract => {
   //         return deployedContract.getElection(id);
   //     }).then(election => {
   //         if(!election){
   //             return Promise.reject(null);
   //         }
   //
   //         return Promise.resolve(election);
   //     }).catch(error => {
   //         console.error(error);
   //     });
   // }
   //
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
