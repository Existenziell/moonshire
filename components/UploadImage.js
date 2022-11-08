import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import Image from 'next/image'
import uploadImage from '../lib/supabase/uploadImage'
import useApp from "../context/App"

export default function UploadImage({ bucket, url, size, onUpload }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [height, setHeight] = useState(0)
  const { darkmode } = useApp()

  useEffect(() => {
    if (url) {
      setImageUrl(`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${bucket}/${url}`)
    }
    setHeight(window.innerHeight - 260)
  }, [url])

  return (
    <>
      {imageUrl ?
        <div className='relative'>
          <Image
            width={height}
            height={height}
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
        :
        <div className='relative'>
          <Image
            width={height}
            height={height}
            src={darkmode === 'light' ? `/upload.png` : `/upload-dark.png`}
            alt="Upload Image"
          />

          {uploading &&
            <div className='absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center pt-20'>
              <PulseLoader color={'white'} size={4} />
            </div>
          }
          <label htmlFor="single" className='opacity-0 absolute top-0 left-0 bottom-0 right-0'>
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={(e) => uploadImage(e, bucket, setUploading, onUpload)}
              disabled={uploading}
            />
          </label>
        </div>
      }
    </>
  )
}
