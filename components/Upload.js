import { useEffect, useState } from 'react'
import downloadImage from '../../lib/downloadImage'
import uploadImage from '../../lib/uploadImage'

export default function PickupImage({ url, size, onUpload, setPicture }) {
  const [pickupImageUrl, setPickupImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const bucket = 'pickups'

  useEffect(() => {
    if (url) downloadImage(bucket, url, setPickupImageUrl)
    if (url) setPicture(url)
  }, [url])

  return (
    <div>
      {pickupImageUrl ? (
        <img
          src={pickupImageUrl}
          alt="Pickup Image"
          className="rounded my-4 shadow-lg"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="no-image h-12" />
      )}
      <div style={{ width: size }}>
        <label className="text-lg" htmlFor="single">
          {uploading ?
            'Uploading...'
            :
            <span className='cursor-pointer link'>Upload Image</span>
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
      </div>
    </div>
  )
}
