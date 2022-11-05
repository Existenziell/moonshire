import { supabase } from "./supabase"

const logEvent = async (type = 'ERROR', txHash = '', wallet = '', userId = 0, nftId = 0, price = 0, tokenId = 0) => {
  const { error } = await supabase
    .from('events')
    .insert([{
      type,
      wallet,
      user: userId,
      nft: nftId,
      price,
      tokenId,
      txHash,
    }])
  if (!error) return true
}

export default logEvent
