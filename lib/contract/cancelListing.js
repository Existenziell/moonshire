import { ethers } from 'ethers'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { marketplaceAddress } from '../../config'

export default async function cancelListing(tokenId, signer) {
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const transaction = await contract.cancelListing(tokenId)
  const result = await transaction.wait()
  return (result.transactionHash)
}
