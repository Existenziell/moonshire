import { supabase } from "../supabase"

export const getArtistId = async (name) => {
  const { data: artist } = await supabase
    .from('artists')
    .select(`*`)
    .eq('name', name)
    .single()

  if (!artist) return false
  return artist.id
}
