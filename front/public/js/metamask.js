// Constants
const CONTRACT_ADDRESS = "0x1224a793D5aa1C789Fe12552940129C0557c82fA";
const CONTRACT_ABI = [
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
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
        name: "reward",
        type: "uint256",
      },
    ],
    name: "GamePlayed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
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
    name: "Log",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
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
        internalType: "address",
        name: "player2",
        type: "address",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "gameCount",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "playGame",
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
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
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
];

// State variables
let currentAccount = null;

// DOM Elements
const balanceDisplay = document.getElementById("balanceDisplay");
const walletAddress = document.getElementById("walletAddress");
const withdrawStatus = document.getElementById("withdrawStatus");
const addBalanceStatus = document.getElementById("addBalanceStatus");
const gameCodeSection = document.getElementById("gameCodeSection");
const createGameButton = document.getElementById("createGame");
const joinGameButton = document.getElementById("joinGame");

// Initialize ethers.js provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// Utility: Show error messages
const handleError = (error, element, message) => {
  console.error(message, error);
  if (element) element.textContent = message;
};

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (!window.ethereum)
    return alert("Please install MetaMask to use this DApp.");
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];
    walletAddress.textContent = `Connected: ${currentAccount}`;
    await updateGameCodeSectionAvailability();
  } catch (error) {
    handleError(error, null, "Error connecting wallet.");
  }
});

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (!window.ethereum)
    return alert("Please install MetaMask to use this DApp.");
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];
    walletAddress.textContent = `Connected: ${currentAccount}`;
    
    // Save wallet address to local storage
    localStorage.setItem("currentWalletAddress", currentAccount);
    
    await updateGameCodeSectionAvailability();
  } catch (error) {
    handleError(error, null, "Error connecting wallet.");
  }
});

// Check Balance
document.getElementById("checkBalance").addEventListener("click", async () => {
  if (!currentAccount) return alert("Please connect your wallet first.");
  try {
    // Access the player's balance using the mapping
    const balance = await contract.playerBalances(currentAccount);
    balanceDisplay.textContent = `Balance: ${ethers.utils.formatEther(
      balance
    )} TBNB`;
    await updateGameCodeSectionAvailability();
  } catch (error) {
    handleError(error, balanceDisplay, "Error checking balance.");
  }
});

// Withdraw Funds
document.getElementById("withdrawFunds").addEventListener("click", async () => {
  if (!currentAccount) return alert("Please connect your wallet first.");
  try {
    const amount = await contract.playerBalances(currentAccount); // Fetch current player's balance
    const tx = await contract.withdraw(amount); // Pass the amount to withdraw
    withdrawStatus.textContent =
      "Transaction sent. Waiting for confirmation...";
    await tx.wait();
    withdrawStatus.textContent = "Funds withdrawn successfully!";
  } catch (error) {
    handleError(error, withdrawStatus, "Error during withdrawal.");
  }
});

// Update Game Code Section Availability
async function updateGameCodeSectionAvailability() {
  if (!currentAccount) {
    gameCodeSection.classList.add("disabled");
    createGameButton.disabled = true;
    joinGameButton.disabled = true;
    return;
  }
  try {
    // Use playerBalances to fetch the balance
    const balance = await contract.playerBalances(currentAccount);
    const balanceInEther = ethers.utils.formatEther(balance);
    const hasSufficientBalance = parseFloat(balanceInEther) >= 0.01;

    gameCodeSection.classList.toggle("disabled", !hasSufficientBalance);
    createGameButton.disabled = !hasSufficientBalance;
    joinGameButton.disabled = !hasSufficientBalance;
  } catch (error) {
    handleError(error, null, "Error checking balance for game availability.");
  }
}
