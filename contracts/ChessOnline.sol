// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/security/ReentrancyGuard.sol";

contract Chess is ReentrancyGuard {
    mapping(address => uint256) public playerBalances;
    uint256 public constant FIXED_DEPOSIT_AMOUNT = 0.01 ether;

    event Deposited(address indexed player, uint256 amount);
    event Withdrawn(address indexed player, uint256 amount);
    event GamePlayed(address indexed player1, address indexed player2, address winner);

    /// @dev Allows a player to deposit exactly 0.01 TBNB
    function deposit() external payable {
        require(msg.value == FIXED_DEPOSIT_AMOUNT, "Deposit must be exactly 0.01 TBNB");
        playerBalances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @dev Allows a player to withdraw their entire balance
    function withdraw() external nonReentrant {
        uint256 balance = playerBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        playerBalances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(msg.sender, balance);
    }

    /// @dev Function to simulate a chess game between two players
    /// @param player2 The opponent's address
    /// @param winner The winner's address (player1 or player2)
    function playGame(address player2, address winner) external {
        require(playerBalances[msg.sender] >= FIXED_DEPOSIT_AMOUNT, "Player 1 must have deposited");
        require(playerBalances[player2] >= FIXED_DEPOSIT_AMOUNT, "Player 2 must have deposited");
        require(winner == msg.sender || winner == player2, "Invalid winner");

        // Deduct the stake amount from both players
        playerBalances[msg.sender] -= FIXED_DEPOSIT_AMOUNT;
        playerBalances[player2] -= FIXED_DEPOSIT_AMOUNT;

        // Award the total stakes (0.02 TBNB) to the winner
        playerBalances[winner] += 2 * FIXED_DEPOSIT_AMOUNT;

        emit GamePlayed(msg.sender, player2, winner);
    }

    /// @dev Returns the balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @dev Returns the balance of a specific player
    function getPlayerBalance(address player) external view returns (uint256) {
        return playerBalances[player];
    }
}
