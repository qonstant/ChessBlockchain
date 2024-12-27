let gameHasStarted = false;
var board = null;
var game = new Chess();
var $status = $("#status");
var $pgn = $("#pgn");
let gameOver = false;
let winnerAddress = "";
let contract; // Your smart contract instance
let web3; // Web3.js instance

const contractAddress = "0x4a97d77B26cFB4779236297628A2A8954dDdDAc4";

// Replace with your smart contract's ABI and address
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player2",
        type: "address",
      },
    ],
    name: "GameJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Refunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WinnerPaid",
    type: "event",
  },
  {
    inputs: [],
    name: "FIXED_DEPOSIT_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "code",
        type: "string",
      },
    ],
    name: "createGameWithCode",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isRefunded",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "code",
        type: "string",
      },
    ],
    name: "joinGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "payWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "code",
        type: "string",
      },
    ],
    name: "requestRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]; // The ABI of your contract

// Initialize Web3 and contract instance
async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Web3 initialized:", web3);
      console.log("Contract initialized:", contract);
    } catch (error) {
      console.error("Web3 initialization failed:", error);
    }
  } else {
    console.error("Ethereum provider not detected.");
  }
}

// Ensure the contract is initialized before other functions use it
document.addEventListener("DOMContentLoaded", async () => {
  await initWeb3();
  console.log("Web3 and contract ready!");
});

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (!gameHasStarted) return false;
  if (gameOver) return false;

  if (
    (playerColor === "black" && piece.search(/^w/) !== -1) ||
    (playerColor === "white" && piece.search(/^b/) !== -1)
  ) {
    return false;
  }

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  let theMove = {
    from: source,
    to: target,
    promotion: "q",
  };
  var move = game.move(theMove);

  if (move === null) return "snapback";

  socket.emit("move", theMove);
  updateStatus();
}

socket.on("newMove", function (move) {
  game.move(move);
  board.position(game.fen());
  updateStatus();
});

function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
    handleGameOver(moveColor); // Handle winner
  } else if (game.in_draw()) {
    status = "Game over, drawn position";
  } else if (gameOver) {
    status = "Opponent disconnected, you win!";
    handleGameOver(moveColor); // Handle winner
  } else if (!gameHasStarted) {
    status = "Waiting for black to join";
  } else {
    status = moveColor + " to move";

    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: "/public/img/chesspieces/wikipedia/{piece}.png",
};
board = Chessboard("myBoard", config);
if (playerColor == "black") {
  board.flip();
}

updateStatus();

// Function to log wallet address from local storage and set winner address
function logWalletAddress() {
  try {
    const walletData = localStorage.getItem("currentWalletAddress");
    if (walletData) {
      winnerAddress = JSON.parse(walletData) || walletData;
      console.log("Winner Address:", winnerAddress);
    } else {
      console.warn("No wallet address found in localStorage.");
    }
  } catch (error) {
    console.error("Failed to parse winner address:", error);
  }
}

var urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("code")) {
  socket.emit("joinGame", {
    code: urlParams.get("code"),
  });
  logWalletAddress(); // Log wallet address after joining game
}

socket.on("startGame", function () {
  gameHasStarted = true;
  updateStatus();
  logWalletAddress(); // Log wallet address after game starts
});

socket.on("gameOverDisconnect", function () {
  gameOver = true;
  updateStatus();
  logWalletAddress(); // Log wallet address after game over or disconnect
});

// Function to handle the end of the game and send balance to the winner
async function handleGameOver(winnerColor) {
    gameOver = true;
    updateStatus();

    // Ensure winnerAddress is initialized
    if (!winnerAddress) {
        console.warn("Winner address not initialized!");
        const walletData = localStorage.getItem("currentWalletAddress");
        if (walletData) {
            winnerAddress = JSON.parse(walletData) || walletData;
        } else {
            console.error("No winner address available!");
            return;
        }
    }

    let winnerWallet = "";
    if (winnerColor === "White") {
        winnerWallet = winnerAddress;
    } else if (winnerColor === "Black") {
        winnerWallet = winnerAddress;
    }

    console.log("Winner Address:", winnerWallet);

    // Redirect to another page with the winner information
    const redirectUrl = `/winner.html?winnerColor=${winnerColor}&wallet=${winnerWallet}`;
    alert(`Game over! Redirecting to the winner page.`);
    window.location.href = redirectUrl;
}

// Function to get the wallet address of the loser based on the player color
async function getLoserWallet(color) {
  try {
    // You can modify this based on how you retrieve wallet addresses for each player
    const playerAddress = localStorage.getItem(`player${color}Address`);
    return playerAddress || "Wallet address not found";
  } catch (error) {
    console.error(`Error retrieving ${color} player wallet address:`, error);
    return "Error fetching wallet address";
  }
}

// Function to get the wallet address of the loser based on the player color
async function getLoserWallet(color) {
  try {
    // You can modify this based on how you retrieve wallet addresses for each player
    const playerAddress = localStorage.getItem(`player${color}Address`);
    return playerAddress || "Wallet address not found";
  } catch (error) {
    console.error(`Error retrieving ${color} player wallet address:`, error);
    return "Error fetching wallet address";
  }
}

// Function to send balance to the winner
async function ensureContractReady() {
  if (!contract || !web3) {
    console.warn("Web3 or contract instance not ready. Initializing...");
    await initWeb3();
  }
}

async function sendBalanceToWinner(winnerWallet) {
    await ensureContractReady(); // Ensure Web3 and contract are initialized

    if (!contract || !winnerWallet) {
        console.warn("Contract or winner address not initialized.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // Current account in use

        // Call the smart contract method to distribute winnings
        const receipt = await contract.methods
            .payWinner("game-code", winnerWallet) // Replace "game-code" with the actual game code
            .send({ from: account });

        console.log("Prize claimed successfully! Transaction Receipt:", receipt);

        // Update the UI to notify the user
        const winnerDisplay = document.getElementById("winner-display");
        winnerDisplay.innerHTML = `🎉 Prize claimed successfully! Winner: <strong>${winnerWallet}</strong>`;
    } catch (error) {
        console.error("Failed to claim prize:", error);
        alert("Failed to claim the prize. Please try again.");
    }
}

// Initialize Web3 and the contract when the page loads
initWeb3();

function printWalletData() {
  try {
    // Retrieve wallet addresses from localStorage
    const winnerAddress = localStorage.getItem("currentWalletAddress");
    const playerWhiteAddress = localStorage.getItem("playerWhiteAddress");
    const playerBlackAddress = localStorage.getItem("playerBlackAddress");

    // Print the retrieved data in the browser's console (terminal)
    console.log(
      "Winner Address:",
      winnerAddress || "No winner address found in localStorage"
    );
    console.log(
      "White Player Address:",
      playerWhiteAddress || "No white player address found in localStorage"
    );
    console.log(
      "Black Player Address:",
      playerBlackAddress || "No black player address found in localStorage"
    );
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
}

// Call this function to print wallet data to the terminal
printWalletData();

// Ensure the document is loaded before attaching event listeners
DOMContentLoaded