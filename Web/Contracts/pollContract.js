const Web3 = require('web3');
let web3;
let pollFactoryContract;

module.exports = class PollFactory {
    constructor() {

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider)
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            //Clé public de l'utilisateur par default
            web3.eth.accounts[0] = '0x76ec2ce0f60e670315ad30273b28bd5df213f482';
        }
        //Liste les comptes possédant du crédit
        web3.eth.getAccounts(console.log);

        //Compte associé aux transactions par default
        web3.eth.defaultAccount = web3.eth.accounts[0];

        // Récupération des informations du contrat
        let fs = require('fs');
        let jsonFile = "C:\\Users\\JUAN\\PhpstormProjects\\epoll\\Truffle\\build\\contracts\\PollFactory.json";
        let parsed= JSON.parse(fs.readFileSync(jsonFile));
        let abi = parsed.abi;

        // Création du contrat en spécifiant l'adresse de deploiement
        pollFactoryContract = new web3.eth.Contract(abi, '0x39d8c5deccd40aa8c681781ffdb6a6636819a05f');
    }

    getMessage() {
        return pollFactoryContract
        .then(deployedContract => {
            return deployedContract.getMessage();
        }).then(message => {
            if(!message){
                return Promise.reject(null);
            }

            return Promise.resolve(message);
        });
    }

    createElection(name, candidatureStart, candidatureEnd, voteStart, voteEnd) {
        return pollFactoryContract.methods.createElection(name,candidatureStart,candidatureEnd,voteStart,voteEnd).send({from: web3.eth.defaultAccount, gas:3000000}).then(id => {

                if(!id){
                    return Promise.reject(null);
                }
                return Promise.resolve(id);
        });
    }
};
