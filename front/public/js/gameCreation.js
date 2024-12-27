const contractAddress = "0x1224a793D5aa1C789Fe12552940129C0557c82fA";
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

document
  .getElementById("createGame")
  .addEventListener("click", async function () {
    const code = document.getElementById("codeInput").value;
    if (!currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }

    if (code) {
      try {
        const contractAddress = "0x1224a793D5aa1C789Fe12552940129C0557c82fA";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Ensure balance is sufficient
        const playerBalance = await contract.playerBalances(currentAccount);
        if (ethers.utils.formatEther(playerBalance) < 0.01) {
          alert("Insufficient deposit. Please add balance.");
          return;
        }

        const player2Address = prompt("Enter Player 2's wallet address:");
        if (!ethers.utils.isAddress(player2Address)) {
          alert("Invalid address. Please enter a valid wallet address.");
          return;
        }

        // const tx = await contract.createGame(player2Address, {
        //   gasLimit: ethers.utils.hexlify(300000), // Adjust the gas limit as needed
        // });
        const tx = await contract.createGame(player2Address); // without gasLimit

        document.getElementById("errorMessage").textContent =
          "Transaction sent. Waiting for confirmation...";
        await tx.wait();

        alert(`Game created successfully! Transaction Hash: ${tx.hash}`);
        window.location.replace(`/white?code=${code}`);
      } catch (error) {
        console.error("Error creating game:", error);
        document.getElementById("errorMessage").textContent =
          "Error creating game.";
      }
    } else {
      document.getElementById("errorMessage").textContent =
        "Please enter a code.";
    }
  });

  document.getElementById("joinGame").addEventListener("click", async function () {
    const code = document.getElementById("codeInput").value;
    if (!currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }
  
    if (code) {
      try {
        const contractAddress = "0x1224a793D5aa1C789Fe12552940129C0557c82fA";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
        // Ensure the user has made a deposit
        const playerBalance = await contract.playerBalances(currentAccount);
        if (ethers.utils.formatEther(playerBalance) < 0.01) {
          alert("Insufficient deposit. Please add balance.");
          return;
        }
  
        // Prompt for the game ID (or fetch it based on some logic)
        const gameId = prompt("Enter the game ID to join:");
        if (!gameId) {
          alert("Please enter a valid game ID.");
          return;
        }
  
        // Ensure the gameId is valid (you can implement further validation if needed)
        if (isNaN(gameId) || parseInt(gameId) <= 0) {
          alert("Invalid game ID.");
          return;
        }
  
        // Call the contract's joinGame function with a specified gas limit
        const gasLimit = 300000; // Adjust this value as necessary
        const tx = await contract.joinGame(gameId, {
          gasLimit: ethers.utils.hexlify(gasLimit), // Set the gas limit here
        });
  
        document.getElementById("errorMessage").textContent =
          "Transaction sent. Waiting for confirmation...";
        await tx.wait();
  
        alert(`Successfully joined game! Transaction Hash: ${tx.hash}`);
        window.location.replace(`/black?code=${code}`);
      } catch (error) {
        console.error("Error joining game:", error);
        document.getElementById("errorMessage").textContent =
          "Error joining game.";
      }
    } else {
      document.getElementById("errorMessage").textContent =
        "Please enter a code.";
    }
  });
  