import { supabase } from "../supabase"

const getDbIdForTokenURI = async (tokenURI) => {
  const { data: nft } = await supabase
    .from('nfts')
    .select(`*, collections(*), artists(*)`)
    .eq('tokenURI', tokenURI)

  if (!nft[0]) return false
  return nft[0].id
}

export default getDbIdForTokenURI
