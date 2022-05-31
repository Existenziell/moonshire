import { supabase } from "./supabase"

export const getPublicUrl = async (publicBucket, path) => {
  const { publicURL, error } = await supabase
    .storage
    .from(publicBucket)
    .getPublicUrl(path)

  if (!error) return publicURL
}
