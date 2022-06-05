import { supabase } from "../supabase"

const getDbIdForTokenURI = async (tokenURI) => {
  const { data: nft } = await supabase
    .from('nfts')
    .select(`*, collections(*), artists(*)`)
    .eq('tokenURI', tokenURI)
    .single()

  if (!nft) return false
  return nft.id
}

export default getDbIdForTokenURI
