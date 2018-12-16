pragma solidity ^0.4.23;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PollFactory.sol";

contract TestPollFactory {
    function testGetMessage() public {
        PollFactory pollFactory = PollFactory(DeployedAddresses.PollFactory());
        Assert.equal(pollFactory.getMessage(), "Hello world", "User should read Hello world");
    }

    function testCreateElection() public {
        PollFactory pollFactory = PollFactory(DeployedAddresses.PollFactory());
        uint id = pollFactory.createElection("test", 10, 11, 13, 14);
        Assert.isTrue((id != 0), "User should read Hello world");

        Assert.equal(pollFactory.getElectionsList.length , 1, "Elections size should be 1");
    }
}
