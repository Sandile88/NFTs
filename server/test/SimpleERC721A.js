const { expect } = require ("chai");
const { ethers } = require ("hardhat");

describe ("SimpleERC721A", function () {
    let simpleERC721A, owner;

    const baseURI = "ipfs://QmeUE2jirQnX4FiDzZMEZd1QPDe2ZY9SiRo9ekq3kWvcA1/";


    beforeEach(async () => {
        try {
            [owner] = await ethers.getSigners();
            const SimpleERC721A = await ethers.getContractFactory("SimpleERC721A");

            console.log("hereeee");

            simpleERC721A = await SimpleERC721A.deploy(
                "Anime0",
                "A0",
                "QmeUE2jirQnX4FiDzZMEZd1QPDe2ZY9SiRo9ekq3kWvcA1/",
                6
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
            expect(await simpleERC721A.tokenURI(0)).to.equal(`${baseURI}0.json`);
            
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