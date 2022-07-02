// Set listed state of an NFT:
// When NFT is bought, listed changes to false
// When NFT is listed aka resold (/resell), listed changes to true
// Additionally: if NFT is not listed, set featured to false 
// Possible states: true||false

import { supabase } from "../supabase"

const setItemListedState = async (tokenId, state) => {
  let query = { listed: state }
  if (state === false) {
    query = { listed: state, featured: false }
  }

  await supabase
    .from('nfts')
    .update(query)
    .eq('tokenId', tokenId)
}

export default setItemListedState
