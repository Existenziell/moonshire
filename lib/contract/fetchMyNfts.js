import { ethers } from 'ethers'
import axios from 'axios'

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  marketplaceAddress
} from '../../config'

export default async function fetchMyNfts(provider) {
  const signer = provider.getSigner()
  const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const nfts = await marketplaceContract.fetchMyNfts()

  /* eslint-disable no-undef */
  const items = await Promise.all(nfts.map(async i => {
    /* eslint-enable no-undef */
    const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenURI)

    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
      artist: meta.data.artist,
      collection: meta.data.collection,
      tokenURI
    }
    return item
  }))
  return items
}