import { useEffect, useState } from 'react'
import Image from 'next/image'
import downloadImage from '../lib/supabase/downloadImage'
import uploadImage from '../lib/supabase/uploadImage'

export default function UploadImage({ bucket, url, size = 1000, onUpload }) {
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
        <div className='relative shadow-2xl nextimg md:max-h-[calc(100vh-260px)]'>
          <Image
            width={size}
            height={size}
            placeholder="blur"
            src={imageUrl}
            blurDataURL={imageUrl}
            alt="Upload Image"
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
        <label
          htmlFor="single"
          style={{ width: size, height: size }}
          className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)] md:max-w-[calc(100vh-260px)] block bg-upload dark:bg-upload-dark bg-no-repeat bg-contain hover:cursor-pointer'
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
      )}
    </div>
  )
}
