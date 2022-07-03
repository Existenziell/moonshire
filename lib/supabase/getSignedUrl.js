import { supabase } from "../supabase"

export const getSignedUrl = async (bucket, path) => {
  const { signedURL, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, 86400)

  if (error) {
    console.log(error.message)
  } else {
    return signedURL
  }
}
