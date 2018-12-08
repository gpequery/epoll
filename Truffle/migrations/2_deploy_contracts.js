var pollFactory = artifacts.require("./PollFactory.sol");
var electionFactory = artifacts.require("./ElectionFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(pollFactory);
  deployer.deploy(electionFactory);
};
