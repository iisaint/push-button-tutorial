pragma solidity ^0.4.13;

import '../../contracts/PushButton.sol';

// @dev PushButtonMock mocks current block number

contract PushButtonMock is PushButton {

  uint mock_blockNumber = 1;

  function PushButtonMock () PushButton() {

  }

  function getBlock() constant returns (uint) {
    return mock_blockNumber;
  }

  function setMockedBlockNumber(uint _b) {
    mock_blockNumber = _b;
  }

}