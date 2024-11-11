const hre = require("hardhat");

async function main() {
    const SimpleERC721A = await hre.ethers.getContractFactory("SimpleERC721A");
    const nft = await SimpleERC721A.deploy(
        "Random",
        "ran",
        "QmXzwvrKWut84q6fVbebHQdJddM6DHrCAAbfJa84TAonVU/",
        2
    );

    await nft.waitForDeployment();
    const address = await nft.getAddress();
    console.log("NFT contract deployed to: ", address); 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
