import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import confetti from 'canvas-confetti'
import Head from "next/head"
import Link from "next/link"
import { getPublicUrl } from "../lib/supabase/getPublicUrl"

export default function SuccessCollection() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(null)
  const { id, title, image_url } = router.query

  useEffect(() => {
    const end = Date.now() + (5 * 1000)
    const colors = ['#D6A269', '#ffffff']

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  useEffect(() => {
    if (image_url) fetchImage()
  }, [image_url])

  const fetchImage = async () => {
    const url = await getPublicUrl('collections', image_url)
    setImageUrl(url)
  }

  return (
    <>
      <Head >
        <title>Success | Project Moonshire</title>
        <meta name='description' content="Success | Project Moonshire" />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)]'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-[40px] w-full'>
          <div className='md:w-1/2'>
            <img src={imageUrl} alt='Collection Image' className='aspect-square bg-cover max-h-[calc(100vh-260px)] shadow-2xl' />
          </div>
          <div className='md:w-1/2'>
            <h1 className='mb-0'>{title}</h1>
            <hr className='my-8' />
            <h1>Congratulations</h1>
            <p>Collection was created successfully.</p>
            <hr className='my-8' />
            <div className="flex gap-8 items-center">
              <Link href={`/collections/${id}`}><a className="button button-detail">View Collection</a></Link>
              <Link href='/profile'><a className="button button-detail">Profile</a></Link>
            </div>
            <canvas className="confetti w-0" id="canvas"></canvas>
          </div>
        </div>
      </div>
    </>
  )
}
