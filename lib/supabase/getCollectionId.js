import { supabase } from "../supabase"

export const getCollectionId = async (title) => {
  const { data: collection } = await supabase
    .from('collections')
    .select(`*`)
    .eq('title', title)
    .single()

  if (!collection) return false
  return collection.id
}
