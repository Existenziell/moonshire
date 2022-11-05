import { ethers } from 'ethers'
import { marketplaceAddress } from '../../config'
import { fetchMeta } from './fetchMeta'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default async function fetchMarketItems(signer) {
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const marketItems = await contract.fetchMarketItems()

  const nfts = await Promise.all(marketItems.map(async i => {
    try {
      const tokenURI = await contract.tokenURI(i.tokenId)
      const meta = await fetchMeta(tokenURI)
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      const nft = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image,
        tokenURI,
        artist: meta.data.artist,
        collection: meta.data.collection,
      }
      return nft
    } catch (error) {
      console.log(error)
    }
  }))

  return nfts
}
