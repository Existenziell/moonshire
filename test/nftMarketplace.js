const { expect } = require("chai")

describe("NftMarketplace", function () {
  it("Should create and execute market sales", async function () {

    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()

    const contractAddress = nftMarketplace.address
    console.log("contractAddress:", contractAddress)

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString()
    expect(listingPrice).to.equal((10 ** 12).toString()) // 1000000000000

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()
    console.log('buyerAddress.address', buyerAddress.address)

    /* execute sale of token to another user */
    await nftMarketplace.connect(buyerAddress).buyToken(1, { value: auctionPrice })

    /* resell a token */
    await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      // console.log(item)

      expect(item.price).to.equal(auctionPrice)
      expect(item.owner).to.equal(contractAddress)

      return item
    }))


    expect(items.length).to.equal(2)
  })
})
