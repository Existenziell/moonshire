import { supabase } from "../supabase"

const getUserCollections = async (userId) => {
  const { data: collections } = await supabase
    .from('collections')
    .select(`*`)
    .eq('user', userId)

  if (collections) {
    // Add numberOfNfts to each collection object
    for (let collection of collections) {
      const { data: collectionNfts, error, status } = await supabase
        .from('nfts')
        .select(`*`)
        .eq('collection', collection.id)

      if (error && status !== 406) {
        throw error
      }

      if (collectionNfts) {
        const numberOfNfts = collectionNfts.length
        collection.numberOfNfts = numberOfNfts
      }
    }
    return collections
  }
}

export default getUserCollections
