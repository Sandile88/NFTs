import Web3 from 'web3';
import { useState } from 'react';
import token from "../../server/jsons/erc721a.json"


function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mintingInProgress, setMintingInProgress] = useState(false);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const contractAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
        const instance = new web3Instance.eth.Contract(token, contractAddress);
        setContract(instance);

        const balance = await instance.methods.balanceOf(accounts[0]).call(); //getting balance
        setBalance(balance);
  

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 not found');
    }
  };


  const mintToken = async () => {
    if (contract && accounts.length > 0) {
      try {
        setMintingInProgress(true);
        await contract.methods.mint(1).send({ from: accounts[0] });
        setMintingInProgress(false);
        console.log("NFT minted successfully");

        // trying to get updated balance
        const balance = await contract.methods.balanceOf(accounts[0]).call();
        setBalance(balance);
        
      } catch (error) {
        setMintingInProgress(false);
        console.log("Minting failed: ", error);
        
      }
    }
  }

  return (
    <div>
    <h1>Vending Machine App</h1>
    {web3 ? (
      <div>
        <p>Connected: {accounts[0]}</p>
        <p>NFT Balance: {balance}</p>
        <button onClick={mintToken} disabled={mintingInProgress}>
          {mintingInProgress ? "Minting in progress..." : "Mint NFT"}
        </button>
        
      </div>
    ) : (
      <button onClick={connectWallet}>Connect Wallet</button>
    )}

    <div></div>
  </div>
  )
}

export default App;