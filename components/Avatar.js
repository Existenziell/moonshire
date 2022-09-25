/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import Image from 'next/image'
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
    <div className=''>
      {avatarUrl ? (
        <div className='relative shadow-2xl nextimg'>
          <Image
            width={400}
            height={400}
            placeholder="blur"
            src={avatarUrl}
            blurDataURL={avatarUrl}
            alt="Avatar"
          />
          <label className="absolute top-0 right-0 bottom-0 left-0 w-full h-full hover:cursor-pointer" htmlFor="single">
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
