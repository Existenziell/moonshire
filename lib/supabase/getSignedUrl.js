import { supabase } from "../supabase"

export const getSignedUrl = async (bucket, path) => {
  const { signedURL, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, 60)

  if (!error) return signedURL
}
