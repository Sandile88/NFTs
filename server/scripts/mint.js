const hre = require("hardhat");


async function mintToken() {

    
    const[owner] = await ethers.getSigners();

    const nftCon = await ethers.getContractAt("SimpleERC721A", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const txn = nftCon.mintToken(1);
}

mintToken().catch(error => {
    console.error(error)
    process.exit(1)
});
