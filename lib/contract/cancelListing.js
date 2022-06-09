import { ethers } from 'ethers'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { marketplaceAddress } from '../../config'

export default async function cancelListing(tokenId, signer) {
  let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  let transaction = await contract.cancelListing(tokenId)
  let result = await transaction.wait()
  return (result.transactionHash)
}
