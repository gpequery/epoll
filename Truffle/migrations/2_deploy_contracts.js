var electionFactory = artifacts.require("./ElectionFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(electionFactory);
};
