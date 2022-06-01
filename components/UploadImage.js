import { useEffect, useState } from 'react'
import downloadImage from '../lib/downloadImage'
import uploadImage from '../lib/uploadImage'

export default function UploadImage({ bucket, url, size, onUpload }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) {
      downloadImage(bucket, url, setImageUrl)
    }
  }, [url])

  return (
    <div>
      {imageUrl ? (
        <div className='relative border-2 border-dashed border-detail-dark/60 dark:border-detail rounded-xl p-2'>
          <img
            src={imageUrl}
            alt="Upload Image"
            style={{ height: size, width: size }}
          />
          <button
            className='absolute top-0 right-0 px-2 pb-1 rounded-sm text-detail-dark/80 dark:text-detail hover:text-cta text-3xl dark:hover:text-cta hover:cursor-pointer hover:scale-110 transition-all'
            aria-label='Reset Image'
            onClick={() => setImageUrl(null)}
          >
            &times;
          </button>
        </div>
      ) : (
        <div
          className='border-2 border-dashed border-detail-dark/60 dark:border-detail rounded-xl p-2 hover:border-cta dark:hover:border-cta transition-all'
        >
          <label
            htmlFor="single"
            style={{ width: size, height: size }}
            className='block bg-detail bg-upload-bg bg-no-repeat bg-contain rounded-xl hover:cursor-pointer'
          >
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
              disabled={uploading}
              className='hidden'
            />
          </label>
        </div>
      )}
    </div>
  )
}
