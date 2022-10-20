import { ethers } from 'ethers'
import { fetchMeta } from './fetchMeta'
import { marketplaceAddress } from '../../config'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default async function fetchListedItems(signer) {
  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  const listedItems = await contract.fetchListedItems()

  /* eslint-disable no-undef */
  const nfts = await Promise.all(listedItems.map(async item => {
    /* eslint-enable no-undef */
    try {
      const tokenURI = await contract.tokenURI(item.tokenId)
      const meta = await fetchMeta(tokenURI)
      const price = ethers.utils.formatUnits(item.price.toString(), 'ether')
      const nft = {
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
    } catch (error) {
      console.log(error)
    }
  }))

  nfts.sort(function (a, b) {
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return nfts
}
