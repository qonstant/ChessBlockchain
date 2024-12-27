// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Chess is ReentrancyGuard {
    mapping(address => uint256) public playerBalances;
    uint256 public constant FIXED_DEPOSIT_AMOUNT = 0.01 ether;

    struct Game {
        address player1;
        address player2;
        uint256 stake;
        bool isActive;
        bool isRefunded; // Tracks if the game has been refunded
    }

    uint256 public gameCount;
    mapping(uint256 => Game) public games;

    // Events for logging
    event Deposited(address indexed player, uint256 amount);
    event GameCreated(
        uint256 indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 stake
    );
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event GamePlayed(
        uint256 indexed gameId,
        address indexed winner,
        uint256 reward
    );
    event Refunded(
        uint256 indexed gameId,
        address indexed player,
        uint256 amount
    );

    // Add the Log event declaration
    event Log(string message, address player, uint256 amount);

    /// @dev Allows a player to deposit exactly 0.01 TBNB
    function deposit() external payable {
        require(
            msg.value == FIXED_DEPOSIT_AMOUNT,
            "Must deposit exactly 0.01 TBNB"
        );
        playerBalances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /// @dev Withdraws a specific amount from the player's balance
    function withdraw(uint256 amount) public nonReentrant {
        require(playerBalances[msg.sender] >= amount, "Insufficient balance");
        playerBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    /// @dev Creates a new game with the specified opponent
    /// @param player2 The opponent's address
    function createGame(address player2) external {
        require(
            playerBalances[msg.sender] >= FIXED_DEPOSIT_AMOUNT,
            "Player 1 must have deposited"
        );
        require(player2 != msg.sender, "Cannot play against yourself");

        uint256 gameId = gameCount++;
        games[gameId] = Game({
            player1: msg.sender,
            player2: player2,
            stake: 2 * FIXED_DEPOSIT_AMOUNT,
            isActive: false,
            isRefunded: false
        });

        emit GameCreated(gameId, msg.sender, player2, 2 * FIXED_DEPOSIT_AMOUNT);
        emit Log("CreateGame called", player2, 2 * FIXED_DEPOSIT_AMOUNT);
    }

    /// @dev Allows the second player to join the game
    /// @param gameId The ID of the game to join
    function joinGame(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.player2 == msg.sender, "Only Player 2 can join this game");
        require(
            playerBalances[msg.sender] >= FIXED_DEPOSIT_AMOUNT,
            "Player 2 must have deposited"
        );
        require(!game.isActive, "Game already active");

        game.isActive = true;
        emit GameJoined(gameId, msg.sender);
    }

    /// @dev Declares the winner of a game and transfers the stakes
    /// @param gameId The ID of the game
    /// @param winner The address of the winning player
    function playGame(uint256 gameId, address winner) external nonReentrant {
        Game storage game = games[gameId];
        require(game.isActive, "Game is not active");
        require(
            winner == game.player1 || winner == game.player2,
            "Invalid winner"
        );

        // Deduct the stake amount from both players
        playerBalances[game.player1] -= FIXED_DEPOSIT_AMOUNT;
        playerBalances[game.player2] -= FIXED_DEPOSIT_AMOUNT;

        // Award the total stake to the winner
        uint256 reward = game.stake;
        playerBalances[winner] += reward;

        // Mark the game as inactive
        game.isActive = false;

        emit GamePlayed(gameId, winner, reward);
    }

    /// @dev Allows players to request a refund if the game was not played
    /// @param gameId The ID of the game to request a refund for
    function requestRefund(uint256 gameId) external nonReentrant {
        Game storage game = games[gameId];
        require(!game.isActive, "Game is active, cannot refund");
        require(!game.isRefunded, "Refund already processed");
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "Only players can request a refund"
        );

        uint256 refundAmount = FIXED_DEPOSIT_AMOUNT;

        if (msg.sender == game.player1 || msg.sender == game.player2) {
            playerBalances[msg.sender] += refundAmount;
            game.isRefunded = true;
            emit Refunded(gameId, msg.sender, refundAmount);
        }
    }

    /// @dev Returns the balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
