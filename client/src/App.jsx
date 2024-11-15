import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import token from "../../server/artifacts/contracts/SimpleERC721A.sol/SimpleERC721A.json";

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nftImages, setNftImages] = useState([]);
  const [mintingInProgress, setMintingInProgress] = useState(false);

  useEffect(() => {
    if (connected && walletAddress) {
      initializeContract();
    }
  }, [connected, walletAddress]);

  async function initializeContract() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const nftContract = new ethers.Contract(
        contractAddress,
        token.abi,
        signer
      );
      setContract(nftContract);

      const nftBalance = await nftContract.balanceOf(walletAddress);
      setBalance(Number(nftBalance));

      const userNfts = await Promise.all(
        Array.from({ length: nftBalance }, (_, i) =>
          nftContract.tokenURI(i)
        )
      );
      setNftImages(userNfts);
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  }


  async function connectWallet() {
    if (!connected) {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });


        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setConnected(true);
        setWalletAddress(address);

        window.ethereum.on('accountsChanged', handleAccountChange);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      setConnected(false);
      setWalletAddress("");
      setContract(null);
      setBalance(0);
    }
  }

  const handleAccountChange = async (accounts) => {
    if (accounts.length === 0) {
      setConnected(false);
      setWalletAddress("");
      setContract(null);
      setBalance(0);
    } else {
      setWalletAddress(accounts[0]);
    }
  };
  

  const mintToken = async () => {
    if (!contract || !connected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setMintingInProgress(true);
      const tx = await contract.mint(1);
      await tx.wait();
      const newBalance = await contract.balanceOf(walletAddress);
      setBalance(Number(newBalance));
      
      console.log("NFT minted successfully");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Failed to mint NFT: " + error.message);
    } finally {
      setMintingInProgress(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NFT App</h1>
      {connected ? (
        <div className="space-y-4">
          <p>Connected Address: {walletAddress}</p>
          <p>NFT Balance: {balance}</p>
          {nftImages.map((imageUri, index) => (
            <div key={index}>
              <img src={imageUri} alt={`NFT ${index}`} className="max-w-full h-auto" />
            </div>
          ))}
          <button
            onClick={mintToken}
            disabled={mintingInProgress}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {mintingInProgress ? "Minting in progress..." : "Mint NFT"}
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;