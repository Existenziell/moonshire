import { supabase } from "./supabase"

const updatePrice = async (id, tokenURI, price) => {
  await supabase
    .from('nfts')
    .update({ price: price })
    .eq('tokenId', id)
    .eq('tokenURI', tokenURI)
}

export default updatePrice
