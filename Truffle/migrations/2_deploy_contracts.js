var pollFactory = artifacts.require("./PollFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(pollFactory);
};
