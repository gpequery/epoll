var express = require('express');
var router = express.Router();

var contract = require('truffle-contract');
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

var pollFactoryContract;

const pollFactory = require('../../Truffle/build/contracts/PollFactory.json');

pollFactoryContract = contract(pollFactory);

pollFactoryContract.setProvider(web3.currentProvider);
if (typeof pollFactoryContract.currentProvider.sendAsync !== "function") {
    pollFactoryContract.currentProvider.sendAsync = function() {
        return pollFactoryContract.currentProvider.send.apply(pollFactoryContract.currentProvider, arguments);
    };
}

async function getMessage() {
    let deployedContract = await pollFactoryContract.deployed();
    var message = await deployedContract.getMessage();

    return message;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    getMessage().then(function(message) {
        res.render('index', { data: message });
    }).catch(function(error) {
        res.render('index', { data: error });
    })
});

module.exports = router;
