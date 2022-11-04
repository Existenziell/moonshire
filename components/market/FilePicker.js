import Image from 'next/image'
import useApp from "../../context/App"
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'

export default function FilePicker({ onChange, size = 1000, url, uploading }) {
  const [imageUrl, setImageUrl] = useState(null)
  const { darkmode } = useApp()

  useEffect(() => {
    if (url) {
      setImageUrl(url)
    }
  }, [url])

  return (
    <div className='md:max-h-[calc(100vh-260px)] md:max-w-[calc(100vh-260px)]'>
      {imageUrl ?
        <div className='relative shadow-2xl nextimg'>
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
        :
        <div className='relative'>
          <Image
            width={size}
            height={size}
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
              onChange={(e) => onChange(e)}
            />
          </label>
        </div>
      }
    </div>
  )
}
