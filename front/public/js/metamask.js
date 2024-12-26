// Metamask interaction script

let currentAccount = null;
const balanceDisplay = document.getElementById("balanceDisplay");
const walletAddress = document.getElementById("walletAddress");
const withdrawStatus = document.getElementById("withdrawStatus");

// Handle adding balance
document.getElementById("addBalance").addEventListener("click", async () => {
  if (!currentAccount) {
    alert("Please connect your wallet first.");
    return;
  }
  try {
    // Replace with your contract address and ABI
    const contractAddress = "0x21c56F5aB509aE35585b38a26504A38f91d942F9";
    const contractABI = [
      {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Deposited",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "player1",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "player2",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "winner",
            "type": "address"
          }
        ],
        "name": "GamePlayed",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "player2",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "winner",
            "type": "address"
          }
        ],
        "name": "playGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Withdrawn",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "FIXED_DEPOSIT_AMOUNT",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "player",
            "type": "address"
          }
        ],
        "name": "getPlayerBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "playerBalances",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.deposit({
      value: ethers.utils.parseUnits("0.01", "ether"), // 0.01 TBNB in wei
    });

    document.getElementById("addBalanceStatus").textContent =
      "Transaction sent. Waiting for confirmation...";

    await tx.wait();
    document.getElementById("addBalanceStatus").textContent =
      "Balance added successfully!";
  } catch (error) {
    console.error("Error adding balance:", error);
    document.getElementById("addBalanceStatus").textContent =
      "Error adding balance.";
  }
});

// Connect
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed. Please install it to use this DApp.");
    return;
  }
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];
    walletAddress.textContent = `Connected: ${currentAccount}`;
    console.log("Wallet connected:", currentAccount);
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Could not connect wallet. Please try again.");
  }
});

// Check balance
document.getElementById("checkBalance").addEventListener("click", async () => {
  if (!currentAccount) {
    alert("Please connect your wallet first.");
    return;
  }

  try {
    // Replace with your contract address and ABI
    const contractAddress = "0x21c56F5aB509aE35585b38a26504A38f91d942F9";
    const contractABI = [
      {
        "inputs": [
          { "internalType": "address", "name": "player", "type": "address" }
        ],
        "name": "getPlayerBalance",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Call the contract's getPlayerBalance function
    const balance = await contract.getPlayerBalance(currentAccount);

    // Display the balance in ETH (converting from wei)
    balanceDisplay.textContent = `Balance: ${ethers.utils.formatEther(balance)} TBNB`;
  } catch (error) {
    console.error("Error checking balance:", error);
    balanceDisplay.textContent = "Error checking balance.";
  }
});

// Withdraw funds
// Withdraw funds
document.getElementById("withdrawFunds").addEventListener("click", async () => {
  if (!currentAccount) {
    alert("Please connect your wallet first.");
    return;
  }
  try {
    // Replace with your contract address and ABI
    const contractAddress = "0x21c56F5aB509aE35585b38a26504A38f91d942F9";
    const contractABI = [
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.withdraw();
    withdrawStatus.textContent = "Transaction sent. Waiting for confirmation...";
    await tx.wait();
    withdrawStatus.textContent = "Funds withdrawn successfully!";
  } catch (error) {
    console.error("Error during withdrawal:", error);
    withdrawStatus.textContent = "Withdrawal failed.";
  }
});

