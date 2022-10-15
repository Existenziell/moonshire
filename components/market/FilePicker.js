import { useEffect, useState } from 'react'

export default function FilePicker({ onChange, size = 1000, url }) {
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (url) {
      setImageUrl(url)
    }
  }, [url])

  return (
    <div>
      {imageUrl ? (
        <div className='relative max-w-max'>
          <img
            src={imageUrl}
            alt="Upload Image"
            // style={{ height: size, width: size }}
            className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)]'
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
          className='hover:border-cta dark:hover:border-cta transition-all'
        >
          <label
            htmlFor="single"
            style={{ width: size, height: size }}
            className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)] md:max-w-[calc(100vh-260px)] block bg-upload dark:bg-upload-dark bg-no-repeat bg-contain hover:cursor-pointer'
          >
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={(e) => onChange(e)}
              className='hidden'
            />
          </label>
        </div>
      )}
    </div>
  )
}
