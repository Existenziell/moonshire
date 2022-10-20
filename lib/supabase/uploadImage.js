import { supabase } from '../supabase'

export default async function uploadImage(event, bucket, setUploading, onUpload) {
  try {
    setUploading(true)

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    onUpload(filePath)
  } catch (error) {
    console.log(error.message)
  } finally {
    setUploading(false)
  }
}
