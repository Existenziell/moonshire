import { supabase } from "../supabase"

const getUserNfts = async (userId) => {
  let { data: nfts, error, status } = await supabase
    .from('nfts')
    .select(`*`)
    .eq('user', userId)

  if (error && status !== 406) {
    throw error
  }
  return nfts
}

export default getUserNfts
