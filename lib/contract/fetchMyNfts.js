import { ethers } from 'ethers'
import { marketplaceAddress } from '../../config'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import axios from 'axios'

export default async function fetchMyNfts(signer) {

  const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const ownedNfts = await marketplaceContract.fetchMyNfts()

  /* eslint-disable no-undef */
  const nfts = await Promise.all(ownedNfts.map(async item => {
    /* eslint-enable no-undef */
    const tokenURI = await marketplaceContract.tokenURI(item.tokenId)
    const meta = await axios.get(tokenURI)
    let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
    let nft = {
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
      created_at: meta.data.created_at
    }
    return nft
  }))

  nfts.sort(function (a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  })

  return nfts
}
