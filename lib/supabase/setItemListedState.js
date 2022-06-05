import { supabase } from "../supabase"

// state: true||false
const setItemListedState = async (tokenId, state) => {
  await supabase
    .from('nfts')
    .update({ listed: state })
    .eq('tokenId', tokenId)
}

export default setItemListedState
