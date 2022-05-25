import { useEffect, useState } from 'react'
import downloadImage from '../lib/downloadImage'
import uploadImage from '../lib/uploadImage'

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
          className="rounded border border-brand"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div className='my-8'>
        <label className="text-sm" htmlFor="single">
          {uploading ? 'Uploading ...' : <span className='button button-detail'>Change Avatar</span>}
        </label>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
          disabled={uploading}
          className='hidden'
        />
      </div>
    </div>
  )
}
