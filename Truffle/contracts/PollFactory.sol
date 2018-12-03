pragma solidity ^0.4.23;

contract PollFactory {
  struct Participant {
    string name;
    uint age;
  }

  Participant[] public participants;

  constructor() public {

  }

  function getMessage() returns (string) {
    return "Hello world";
  }

  function createparticipant(string _name, uint _age) internal returns (uint) {
    uint id = participants.push(Participant(_name, _age)) - 1;

    return id;
  }
}
