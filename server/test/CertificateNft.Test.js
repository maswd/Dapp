
// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const  Contract  =require( "ethers");

// describe("CERTNFT", function () {
  
//     let nftContract;
//     let owner='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
//     let owneraddres='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';


//   beforeEach(async () => {
//     const NFTContract=await ethers.getContractFactory("CERTNFT") 
//     nftContract = await NFTContract.deploy(owneraddres, "My NFT", "MNFT");
//     await nftContract.deployed();
//   });
  
//   it("should mint an NFT", async function () {

//     const tx = await nftContract.mint("QmcJH2iYfQ1f9RJjAbf5X5aF4nJSC2GJqRiNKAUx3rSZf6");
//     const receipt = await tx.wait();
    
//     const tokenId = receipt.events[1].args[1];
   
//     const tokenURI = await nftContract.tokenURI(tokenId);
   
//     expect(tokenURI).to.equal("https://ipfs.io/ipfs/QmcJH2iYfQ1f9RJjAbf5X5aF4nJSC2GJqRiNKAUx3rSZf6");
//   });

//   it("should emit a mintnft event", async function () {
//     const tx = await nftContract.mint("QmcJH2iYfQ1f9RJjAbf5X5aF4nJSC2GJqRiNKAUx3rSZf6");
//     const receipt = await tx.wait();
 
//     var tokenId = receipt.events[1].args[1];
//     console.log(tokenId)
//     const event = receipt.events[1];
//     expect(event.event).to.equal("mintnft");
//     expect(event.args[0]).to.equal(owner);
//     expect(event.args[1]).to.equal(tokenId);
//     expect(event.args[2]).to.equal("https://ipfs.io/ipfs/QmcJH2iYfQ1f9RJjAbf5X5aF4nJSC2GJqRiNKAUx3rSZf6");
//     expect(event.args[3]).to.equal("minted nft ");
//   });
//   it("should return token url and tiken id nft minted",async function(){
//      const result=await nftContract.getAllTokenIdsAndUrls();
//      console.log(result)
//   });
//   it("should transfer nft another address",async function(){
//      const from='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
//      const to='0xbd1Cfa5B535AFd040E2443080CFF9fC9B557AF57'
//     //  const approv=await nftContract.setApprovalForAll(from,true)
//      const tx = await nftContract.mint("QmcJH2iYfQ1f9RJjAbf5X5aF4nJSC2GJqRiNKAUx3rSZf6");
//      const receipt = await tx.wait();
     
//      const tokenId = receipt.events[1].args[1];
//      const tx2=await nftContract.transferFrom(from,to,tokenId)
//      const receipt2=tx2.wait();
//     //  console.log(receipt2)
//   })
  
// });
 