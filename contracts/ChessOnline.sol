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
        bool isRefunded;
    }

    uint256 public gameCount;
    mapping(uint256 => Game) public games;

    // Events for logging
    event Deposited(address indexed player, uint256 amount);
    event GameCreated(uint256 indexed gameId, address indexed player1);
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
    event WinnerPaid(
        uint256 indexed gameId,
        address indexed winner,
        uint256 amount
    );

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

    /// @dev Creates a new game and requires 0.01 TBNB from the creator
    function createGame() external payable {
        require(
            msg.value == FIXED_DEPOSIT_AMOUNT,
            "Must send exactly 0.01 TBNB"
        );

        uint256 gameId = gameCount;
        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            stake: msg.value,
            isActive: false,
            isRefunded: false
        });

        gameCount++;
        emit GameCreated(gameId, msg.sender);
    }

    /// @dev Allows a second player to join the game and sends 0.01 TBNB
    /// @param gameId The ID of the game to join
    function joinGame(uint256 gameId) external payable {
        require(
            msg.value == FIXED_DEPOSIT_AMOUNT,
            "Must send exactly 0.01 TBNB"
        );
        Game storage game = games[gameId];

        // require(game.player1 != address(0), "Game does not exist");
        // require(game.player2 == address(0), "Game already has a second player");
        require(!game.isActive, "Game already active");

        game.player2 = msg.sender;
        game.stake += msg.value;
        game.isActive = true;

        emit GameJoined(gameId, msg.sender);
    }

    /// @dev Declares the winner of a game and transfers the stakes
    /// @param gameId The ID of the game
    /// @param winner The address of the winning player
    function payWinner(uint256 gameId, address winner) external nonReentrant {
        Game storage game = games[gameId];

        require(game.isActive, "Game is not active");
        require(
            winner == game.player1 || winner == game.player2,
            "Invalid winner"
        );

        uint256 reward = game.stake;
        game.isActive = false;

        (bool success, ) = winner.call{value: reward}("");
        require(success, "Transfer to winner failed");

        emit WinnerPaid(gameId, winner, reward);
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
        game.stake -= refundAmount;
        game.isRefunded = true;

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit Refunded(gameId, msg.sender, refundAmount);
    }

    /// @dev Returns the balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
