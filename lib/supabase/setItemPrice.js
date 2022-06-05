import { supabase } from "../supabase"

const setItemPrice = async (id, tokenURI, price) => {
  await supabase
    .from('nfts')
    .update({ price: price })
    .eq('tokenId', id)
    .eq('tokenURI', tokenURI)
}

export default setItemPrice
