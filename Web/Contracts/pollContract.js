var contract = require('truffle-contract');
var Web3 = require('web3');

module.exports = class PollFactory {
   constructor() {
       if (typeof web3 !== 'undefined') {
           var web3 = new Web3(web3.currentProvider)
       } else {
           var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
       }

       const pollFactory = require('../../Truffle/build/contracts/PollFactory.json');

       var pollFactoryContract = contract(pollFactory);

       pollFactoryContract.setProvider(web3.currentProvider);
       if (typeof pollFactoryContract.currentProvider.sendAsync !== "function") {
           pollFactoryContract.currentProvider.sendAsync = function() {
               return pollFactoryContract.currentProvider.send.apply(pollFactoryContract.currentProvider, arguments);
           };
       }

       this.deployedContract = pollFactoryContract.deployed();
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
}
