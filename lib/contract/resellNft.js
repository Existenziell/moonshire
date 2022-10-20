import { ethers } from 'ethers'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { marketplaceAddress } from '../../config'

export default async function resellNft(id, price, signer) {
  if (!price) return
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

  const priceFormatted = ethers.utils.parseUnits(price, 'ether')
  let listingPrice = await contract.getListingPrice()
  listingPrice = listingPrice.toString()

  const transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
  const result = await transaction.wait()
  return (result.transactionHash)
}
