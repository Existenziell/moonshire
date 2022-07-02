/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import downloadImage from '../lib/supabase/downloadImage'
import uploadImage from '../lib/supabase/uploadImage'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const bucket = 'avatars'

  useEffect(() => {
    if (url) downloadImage(bucket, url, setAvatarUrl)
  }, [url])

  return (
    <div className='md:w-1/2'>
      {avatarUrl ? (
        <div className='relative'>
          <img
            src={avatarUrl}
            alt="Avatar"
            className="shadow-2xl max-h-[calc(100vh-260px)] aspect-square bg-cover"
          />
          <label className="absolute top-0 right-0 bottom-0 left-0 w-full h-full" htmlFor="single">
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
              disabled={uploading}
              className='hidden z-20'
            />
          </label>
        </div>
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
    </div>
  )
}
