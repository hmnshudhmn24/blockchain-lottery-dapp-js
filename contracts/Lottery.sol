// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;
    uint public lastWinningAmount;
    uint public lotteryEndTime;
    uint public entryFee = 0.1 ether;
    
    event LotteryEntered(address indexed player);
    event WinnerPicked(address indexed winner, uint amount);
    
    constructor(uint _duration) {
        manager = msg.sender;
        lotteryEndTime = block.timestamp + _duration;
    }
    
    function enter() public payable {
        require(block.timestamp < lotteryEndTime, "Lottery has ended");
        require(msg.value == entryFee, "Entry fee is 0.1 ETH");
        players.push(msg.sender);
        emit LotteryEntered(msg.sender);
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    function pickWinner() public restricted {
        require(block.timestamp >= lotteryEndTime, "Lottery is still ongoing");
        require(players.length > 0, "No players in the lottery");
        uint index = random() % players.length;
        address winner = players[index];
        lastWinner = winner;
        lastWinningAmount = address(this).balance;
        payable(winner).transfer(address(this).balance);
        emit WinnerPicked(winner, lastWinningAmount);
        players = new address[](0);
        lotteryEndTime = block.timestamp + 1 weeks; // Restart lottery
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function getLotteryInfo() public view returns (uint, uint, address, uint) {
        return (lotteryEndTime, players.length, lastWinner, lastWinningAmount);
    }
    
    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this");
        _;
    }
}
