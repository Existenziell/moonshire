/* eslint-disable no-unused-vars */
import { supabase } from "./supabase"

const logEvent = async (type = 'ERROR', userId = 0, nftId = 0, price = 0, tokenId = 0) => {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      type,
      user: userId,
      nft: nftId,
      price,
      tokenId,
    }])
  if (!error) return true
}

export default logEvent
