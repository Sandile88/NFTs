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
  const [tokenIds, setTokenIds] = useState([]);

  


  const baseUrl = "https://aquamarine-patient-mite-640.mypinata.cloud/ipfs/QmeUE2jirQnX4FiDzZMEZd1QPDe2ZY9SiRo9ekq3kWvcA1/";
  // const totalImgs = 1;


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
      setBalance(parseInt(nftBalance.toString()));


       // Fetching the token IDs for owned NFTs
       const ownedTokenIds = [];
       for (let i = 0; i < nftBalance; i++) {
           const tokenId = await nftContract.tokenOfOwnerByIndex(walletAddress, i);
           ownedTokenIds.push(tokenId.toString());
       }
       setTokenIds(ownedTokenIds);


        const imageUrls = ownedTokenIds.map((id) => `${baseUrl}${id}.jpg`);
        setNftImages(imageUrls);



      // const imageUrls = Array.from({ length: totalImgs }, (_, i)  => `${baseUrl}${i}.jpg`);
      // setNftImages(imageUrls);
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
      setTokenIds([]);
      setNftImages([]);
    }
  }

  const handleAccountChange = async (accounts) => {
    if (accounts.length === 0) {
      setConnected(false);
      setWalletAddress("");
      setContract(null);
      setBalance(0);
      setTokenIds([]);
      setNftImages([]);
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
      
        const ownedTokenIds = [];
        for (let i = 0; i < newBalance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
            ownedTokenIds.push(tokenId.toString());
        }
        setTokenIds(ownedTokenIds);

        const imageUrls = ownedTokenIds.map((id) => `${baseUrl}${id}.jpg`);
        setNftImages(imageUrls);

        
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
  <div key={index} style={{ 
      margin: '10px', 
      position: 'relative', 
      width: '300px', 
      height: '220px', 
      overflow: 'hidden' 
    }} className="flex items-center justify-center rounded-lg shadow-md">
    
    <img src={imageUri} alt={`NFT ${index}`} 
      className="object-cover w-full h-full" 
      style={{ width: '100%', height: '100%' }}
    />
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