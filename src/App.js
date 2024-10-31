import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';

// Import the contract address and the ABI
const ADDRESS = "0x1EC506f759fc36Dd0430D7B5876E989360179D5a";
const ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "startingPoint", "type": "uint256" },
      { "internalType": "string", "name": "startingMessage", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  { "inputs": [], "name": "decreaseNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "increaseNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "message", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "newMessage", "type": "string" }], "name": "setmessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

// Initialize the state for number and message
const App = () => {
  const [number, setNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [web3, setWeb3] = useState(null);
  const [myContract, setMyContract] = useState(null);

  useEffect(() => {
    // Check if Web3 is available
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      const contractInstance = new web3Instance.eth.Contract(ABI, ADDRESS);
      setWeb3(web3Instance);
      setMyContract(contractInstance);
    } else {
      console.error("Ethereum provider not found");
    }
  }, []);

  // Reading functions
  const getNumber = async () => {
    try {
      const result = await myContract.methods.getNumber().call();
      setNumber(result.toString()); // Call toString() correctly
    } catch (error) {
      console.error("Error fetching number:", error);
      setNumber(null); // Set to null or handle accordingly
    }
  };

  // Increasing the number
  const increaseNumber = async () => {
    try {
      const accountsConnected = await web3.eth.requestAccounts();
      const tx = await myContract.methods.increaseNumber().send({ from: accountsConnected[0] });
      console.log("Transaction successful:", tx);
      getNumber();
    } catch (error) {
      console.error("Error increasing number:", error);
    }
  };

  // Decreasing the number
  const decreaseNumber = async () => {
    try {
      const accountsConnected = await web3.eth.requestAccounts();
      const tx = await myContract.methods.decreaseNumber().send({ from: accountsConnected[0] });
      console.log("Transaction successful:", tx);
      getNumber();
    } catch (error) {
      console.error("Error decreasing number:", error);
    }
  };

  // Updating the message
  const updateMessage = async () => {
    try {
      const accountsConnected = await web3.eth.requestAccounts();
      await myContract.methods.setmessage(message).send({ from: accountsConnected[0] });
      console.log("Message updated");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // Rendering the UI
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={getNumber}>Get Number</button>
        <br />
        <button onClick={decreaseNumber}>Decrease Number</button>
        <br />
        <button onClick={increaseNumber}>Increase Number</button>
        <br />
        <p>Number: {number !== null ? number : "Loading..."}</p>
        <br />
        <input
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button onClick={updateMessage}>Update Message</button>
      </header>
    </div>
  );
};

export default App;

