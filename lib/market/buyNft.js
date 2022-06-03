import { ethers } from 'ethers'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  marketplaceAddress
} from '../../config'

export default async function buyNft(nft, provider) {
  const signer = provider.getSigner()
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

  /* user will be prompted to pay the asking proces to complete the transaction */
  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  try {
    const transaction = await contract.buyToken(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    return transaction.hash
  } catch (error) {
    console.log(error)
    return false
  }
}
