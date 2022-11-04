import { supabase } from "../supabase"

const setItemOwner = async (tokenId, currentUserId) => {
  const { error } = await supabase
    .from('nfts')
    .update({
      owner: currentUserId
    })
    .eq('tokenId', tokenId)

  if (!error) {
    return true
  }
}

export default setItemOwner
