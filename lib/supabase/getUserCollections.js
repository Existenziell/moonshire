import { supabase } from "../supabase"
import { getPublicUrl } from '../supabase/getPublicUrl'

const getUserCollections = async (walletAddress) => {
  let { data: collections } = await supabase
    .from('collections')
    .select(`*`)
    .eq('walletAddress', walletAddress)

  if (collections) {
    // Add numberOfNfts to each collection object
    for (let collection of collections) {
      let { data: collectionNfts, error, status } = await supabase
        .from('nfts')
        .select(`*`)
        .eq('collection', collection.id)

      if (error && status !== 406) {
        throw error
      }

      let url = await getPublicUrl('collections', collection.image_url)
      collection.public_url = url

      if (collectionNfts) {
        const numberOfNfts = collectionNfts.length
        collection.numberOfNfts = numberOfNfts
      }
    }
    return collections
  }
}

export default getUserCollections