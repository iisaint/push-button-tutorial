pragma solidity ^0.4.13;

contract PushButton {

    uint public startBlock;
    uint public interval = 108 * 60 / 4; // 108 minutes
    uint public nextTimeoutBlock;
    uint public totalPush;
    string public title;

    event ButtonPushed(address indexed _address, uint _totalPush, uint _nextTimeoutBlock);

    modifier isTimeout() {
        require( getBlock() <= nextTimeoutBlock );
        _;
    }

    function PushButton() {
        startBlock = block.number;
        nextTimeoutBlock = startBlock + interval;
        totalPush = 0;
    }

    function push() isTimeout() returns (bool) {
        totalPush += 1;
        nextTimeoutBlock = getBlock() + interval;
        checkTitle();
        ButtonPushed(msg.sender, totalPush, nextTimeoutBlock);
        return true;
    }

    function getBlock() constant returns (uint) {
        return block.number;
    }

    function checkTitle() internal {
        if (totalPush < 10) {
            title = "newbie";
        } else if (totalPush < 1000) {
            title = "apprentice";
        } else if (totalPush < 10000) {
            title = "master";
        } else {
            title = "believer";
        }
    }

}
