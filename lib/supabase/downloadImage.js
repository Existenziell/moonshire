import { supabase } from "../supabase"

export default async function downloadImage(bucket, path, setUrl) {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path)
    if (error) {
      throw error
    }
    const url = URL.createObjectURL(data)
    setUrl(url)
  } catch (error) {
    console.log('Error downloading image: ', error.message)
  }
}
