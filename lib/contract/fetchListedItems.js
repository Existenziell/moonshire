import { ethers } from 'ethers'

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  marketplaceAddress
} from '../../config'
import { fetchMeta } from './fetchMeta'

export default async function fetchListedItems(provider) {
  const signer = provider.getSigner()
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const listedItems = await contract.fetchListedItems()

  /* eslint-disable no-undef */
  const nfts = await Promise.all(listedItems.map(async i => {
    /* eslint-enable no-undef */
    try {
      const tokenURI = await contract.tokenURI(i.tokenId)
      const meta = await fetchMeta(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let nft = {
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
