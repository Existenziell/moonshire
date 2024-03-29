import { ethers } from 'ethers'
import { fetchMeta } from './fetchMeta'

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  marketplaceAddress
} from '../../config'

// If id is passed, function returns only the metadata for the one token
export default async function fetchMarketItemsMeta(id, signer) {
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const marketItems = await contract.fetchMarketItems()

  if (id) {
    const item = marketItems.filter(marketItem => parseInt(marketItem.tokenId) === id)[0]
    if (!item) return

    try {
      const tokenURI = await contract.tokenURI(item.tokenId)
      const meta = await fetchMeta(tokenURI)
      const price = ethers.utils.formatUnits(item.price.toString(), 'ether')
      const enrichedItem = {
        price,
        tokenId: item.tokenId.toNumber(),
        seller: item.seller,
        owner: item.owner,
        sold: item.sold,
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image,
        tokenURI,
        artist: meta.data.artist,
        collection: meta.data.collection,
      }

      return enrichedItem
    } catch (error) {
      console.log(error)
    }
  }

  const meta = await Promise.all(marketItems.map(async i => {
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

  return meta
}
