const Web3 = require('web3');
let web3;

module.exports = class ElectionFactory {

   constructor() {

       if (typeof web3 !== 'undefined') {
           web3 = new Web3(web3.currentProvider);
       } else {
           web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
           //Clé public de l'utilisateur par default
           // web3.eth.accounts[0] = '0xf20da7630233a0ed372e49a4b84384a3c913a189';
           //Liste les comptes possédant du crédit
           let accounts =  web3.eth.getAccounts();
           web3.eth.accounts[0] = accounts[0];
       }
        console.log('ACCOUNT :' + web3.eth.accounts[0]);
       //Liste les comptes possédant du crédit
       web3.eth.getAccounts(console.log);

       //Compte associé aux transactions par default
       web3.eth.defaultAccount = web3.eth.accounts[0];

       // Récupération des informations du contrat
       let fs = require('fs');
       let jsonFile = "C:\\Users\\JUAN\\PhpstormProjects\\epoll\\Truffle\\build\\contracts\\ElectionFactory.json";
       let parsed= JSON.parse(fs.readFileSync(jsonFile));
       let abi = parsed.abi;

       // Création du contrat en spécifiant l'adresse de deploiement
       this.deployedContract = new web3.eth.Contract(abi, '0x499a18463ba0709aced21e9a6fde597e7d11b7a7');
   }



   createElection(name, candidatureStart, candidatureEnd, voteStart, voteEnd) {
       let account = web3.eth.defaultAccount;
       console.log(account);
       return this.deployedContract.methods.createElection(name,candidatureStart,candidatureEnd,voteStart,voteEnd)
           .send({from: account, gas:3000000})
           .then(id => {
           if(!id){
               return Promise.reject(null);
           }
           return Promise.resolve( parseInt(id,10));
           }).catch(error => {
               console.error(error);
           });
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
