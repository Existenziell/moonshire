import { useEffect, useState } from 'react'
import useApp from "../context/App"
import Image from 'next/image'
import downloadImage from '../lib/supabase/downloadImage'
import uploadImage from '../lib/supabase/uploadImage'
import { PulseLoader } from 'react-spinners'

export default function Avatar({ url, size = 400, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { darkmode } = useApp()
  const bucket = 'avatars'

  useEffect(() => {
    if (url) downloadImage(bucket, url, setAvatarUrl)
  }, [url])

  return (
    <div>
      {avatarUrl ?
        <div className='relative shadow-2xl nextimg'>
          <Image
            width={400}
            height={400}
            placeholder="blur"
            layout='responsive'
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
          <button
            className='absolute top-0 right-0 px-2 pb-1 rounded-sm text-detail-dark/80 dark:text-detail hover:text-cta text-3xl dark:hover:text-cta hover:cursor-pointer hover:scale-110 transition-all'
            aria-label='Reset Image'
            onClick={() => setAvatarUrl(null)}
          >
            &times;
          </button>
        </div>
        :
        <div className='relative'>
          <Image
            width={400}
            height={400}
            layout='responsive'
            placeholder="blur"
            src={darkmode === 'light' ? `/upload.png` : `/upload-dark.png`}
            blurDataURL='/upload.png'
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
    </div>
  )
}
