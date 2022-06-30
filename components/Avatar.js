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
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded shadow-2xl max-h-[calc(100vh-260px)] p-4 bg-detail dark:bg-detail-dark"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      {/* <div className='my-8'>
        <label className="text-sm" htmlFor="single">
          {uploading ?
            <span className='button button-detail mx-auto'>Uploading ...</span>
            :
            <span className='button button-detail mx-auto'>Change Avatar</span>
          }
        </label>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
          disabled={uploading}
          className='hidden'
        />
      </div> */}
    </div>
  )
}
