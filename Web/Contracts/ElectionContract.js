var contract = require('truffle-contract');
var Web3 = require('web3');

module.exports = class ElectionFactory {
   constructor() {
       if (typeof web3 !== 'undefined') {
           var web3 = new Web3(web3.currentProvider)
       } else {
           var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
       }

       const factory = require('../../Truffle/build/contracts/ElectionFactory.json');

       var factoryContract = contract(factory);

       factoryContract.setProvider(web3.currentProvider);
       if (typeof factoryContract.currentProvider.sendAsync !== "function") {
           factoryContract.currentProvider.sendAsync = function() {
               return factoryContract.currentProvider.send.apply(factoryContract.currentProvider, arguments);
           };
       }

       this.deployedContract = factoryContract.deployed();
   }

   getMessage() {
       return this.deployedContract
       .then(deployedContract => {
           return deployedContract.getMessage();
       }).then(message => {
           if(!message){
               return Promise.reject(null);
           }

           return Promise.resolve(message);
       });
   }

   createElection(label) {
       return this.deployedContract
       .then(deployedContract => {
           return deployedContract.createElection(label);
       }).then(id => {
           if(!id){
               return Promise.reject(null);
           }

           return Promise.resolve(id);
       }).catch(error => {
           console.error(error);
       });
   }

   getElection(id) {
       return this.deployedContract
       .then(deployedContract => {
           return deployedContract.getElection(id);
       }).then(election => {
           if(!election){
               return Promise.reject(null);
           }

           return Promise.resolve(election);
       }).catch(error => {
           console.error(error);
       });
   }

   getElectionsSize() {
       return this.deployedContract
       .then(deployedContract => {
           return deployedContract.getElectionsSize();
       }).then(size => {
           return Promise.resolve(size);
       }).catch(error => {
           console.error(error);
       });
   }
}
