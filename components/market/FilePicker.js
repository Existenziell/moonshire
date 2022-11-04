import Image from 'next/image'
import { useEffect, useState } from 'react'
import useApp from "../../context/App"

export default function FilePicker({ onChange, size = 1000, url }) {
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
        <div className='relative max-w-max'>
          <img
            src={imageUrl}
            alt="Upload Image"
            className='aspect-square shadow-2xl'
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
