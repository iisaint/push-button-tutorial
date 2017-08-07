pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PushButton.sol";
import "./helpers/PushButtonMock.sol";

contract TestPushButton {
  PushButton pb = PushButton(DeployedAddresses.PushButton());

  function testInitialUsingDeployedContract() {
    Assert.equal(pb.interval(), 1620, "interval should be 1620 blocks long");
    Assert.equal(pb.nextTimeoutBlock(), pb.startBlock() + 1620, "nextTimeoutBlock should be sum of startblock and interval");
    Assert.equal(pb.totalPush(), 0, "totalPush should be 0");
  }

  function testUserCanPush() {
    uint totalPush = pb.totalPush();
    uint currentBlock = pb.getBlock();
    Assert.equal(pb.push(), true, "push should success");
    Assert.equal(pb.totalPush(), totalPush + 1, "totalPush should increase 1");
    Assert.equal(pb.nextTimeoutBlock(), currentBlock + pb.interval(), "nextTimeoutBlock shoud be reset");
  }

  function testUserCannotPushAfterTimeout() {
    PushButtonMock pb = new PushButtonMock();
    pb.setMockedBlockNumber(pb.nextTimeoutBlock() + 1);
    Assert.equal(pb.push(), false, "push should be fail");
  }

}
