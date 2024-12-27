const contractAddress = "0x4a97d77B26cFB4779236297628A2A8954dDdDAc4";
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
];

document
  .getElementById("createGame")
  .addEventListener("click", async function () {
    const code = document.getElementById("codeInput").value;

    if (!currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!code) {
      document.getElementById("errorMessage").textContent =
        "Please enter a code.";
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Ensure the player has enough balance to create a game
      const playerBalance = await contract.playerBalances(currentAccount);
      const formattedBalance = ethers.utils.formatEther(playerBalance);

      if (parseFloat(formattedBalance) < 0.01) {
        alert("Insufficient deposit. Please add balance.");
        return;
      }

      // Prepare game data
      const gameData = {
        creator: currentAccount,  // Wallet address of creator (black)
        code: code,               // Game code entered by the creator
      };

      // Check if gameData already exists, if not create it
      let existingGameData = localStorage.getItem("gameData");
      if (!existingGameData) {
        // No data found, create a new JSON structure
        localStorage.setItem("gameData", JSON.stringify(gameData));
        console.log("Game data created:", gameData);
      } else {
        console.log("Game data already exists:", JSON.parse(existingGameData));
      }

      // Call the createGame function with the code as the game ID
      const tx = await contract.createGameWithCode(code, {
        value: ethers.utils.parseEther("0.01"), // Fixed deposit amount
      });

      console.log("Transaction details:", tx);

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
  });

document
  .getElementById("joinGame")
  .addEventListener("click", async function () {
    const code = document.getElementById("codeInput").value;

    if (!currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!code) {
      document.getElementById("errorMessage").textContent =
        "Please enter a code.";
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const playerBalance = await contract.playerBalances(currentAccount);
      const formattedBalance = ethers.utils.formatEther(playerBalance);

      if (parseFloat(formattedBalance) < 0.01) {
        alert("Insufficient deposit. Please add balance.");
        return;
      }

      // Prepare game joining data
      const gameJoinData = {
        joiner: currentAccount,  // Wallet address of joiner (white)
        code: code,              // Game code entered by the joiner
      };

      // Check if gameJoinData already exists, if not create it
      let existingJoinData = localStorage.getItem("gameJoinData");
      if (!existingJoinData) {
        // No data found, create a new JSON structure
        localStorage.setItem("gameJoinData", JSON.stringify(gameJoinData));
        console.log("Game join data created:", gameJoinData);
      } else {
        console.log("Game join data already exists:", JSON.parse(existingJoinData));
      }

      // Use the entered code as the game ID
      const gameId = code; // Game ID is now the code
      const gameDetails = await contract.games(gameId);

      const tx = await contract.joinGame(gameId, {
        value: ethers.utils.parseEther("0.01"), // Same deposit amount
      });

      console.log("Transaction details:", tx);

      document.getElementById("errorMessage").textContent =
        "Transaction sent. Waiting for confirmation...";
      await tx.wait();

      alert(`Joined the game successfully! Transaction Hash: ${tx.hash}`);
      window.location.replace(`/black?code=${code}`);
    } catch (error) {
      console.error("Error joining game:", error);
      document.getElementById("errorMessage").textContent =
        "Error joining game.";
    }
  });
