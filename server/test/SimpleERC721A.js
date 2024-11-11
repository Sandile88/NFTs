const { expect } = require ("chai");
const { ethers } = require ("hardhat");

describe ("SimpleERC721A", function () {
    let simpleERC721A, owner;

    beforeEach(async () => {
        try {
            [owner] = await ethers.getSigners();
            const SimpleERC721A = await ethers.getContractFactory("SimpleERC721A");

            console.log("hereeee");

            simpleERC721A = await SimpleERC721A.deploy(
                "Random",
                "ran",
                "QmXzwvrKWut84q6fVbebHQdJddM6DHrCAAbfJa84TAonVU/",
                2
            );

            await simpleERC721A.waitForDeployment();

            const contractAddress = await simpleERC721A.getAddress();
            console.log("Contract address: ", contractAddress);
            
        } catch (error) {
            console.error("Deployment failed: ", error);
            throw error;   
        }
    });

    it("Should mint an NFT", async function () {
        try {
            await simpleERC721A.mintToken(2);

            const totalSupply = await simpleERC721A.totalSupply();
            expect(totalSupply).to.equal(2);

            const tokenId = 1;
            const tokenURI = await simpleERC721A.tokenURI(tokenId);
            console.log("tokkkken: ". tokenURI);
            expect(tokenURI).to.equal("QmXzwvrKWut84q6fVbebHQdJddM6DHrCAAbfJa84TAonVU/1.png");
            
        } catch (error) {
            console.error("Minting failed: ", error);
            throw error;   
        }
        
    });
    

    it("Should have a valid contract address", async function () {
        const contractAddress = await simpleERC721A.getAddress();
        expect(contractAddress).to.be.a('string');
        expect(contractAddress).to.match(/^0x[0-9a-fA-F]{40}$/);
        
    });
});