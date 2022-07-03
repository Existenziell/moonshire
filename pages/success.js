import { useEffect } from "react"
import { useRouter } from "next/router"
import confetti from 'canvas-confetti'
import Head from "next/head"
import Link from "next/link"

export default function Success() {
  const router = useRouter()
  const { id, hash, name, image_url } = router.query

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

  return (
    <>
      <Head >
        <title>Success | Project Moonshire</title>
        <meta name='description' content="Success | Project Moonshire" />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)]'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-[40px] w-full'>
          <div className='md:w-1/2'>
            <img src={image_url} alt='Artist Image' className='aspect-square bg-cover max-h-[calc(100vh-260px)] shadow-2xl' />
          </div>
          <div className='md:w-1/2'>
            <h1 className='mb-0'>{name}</h1>
            <hr className='my-8' />
            <h1 className="">Congratulations</h1>
            <p>Transaction was successfully exectuted on the Blockchain.<br />
              You are now the owner of this NFT.
            </p>
            <p className="mt-4">Transaction hash:</p>
            <p><a href={`https://rinkeby.etherscan.io/tx/${hash}`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{hash}</a></p>
            <hr className='my-8' />
            <div className="flex gap-8 items-center">
              <Link href={`/nfts/${id}`}><a className="button button-detail">View NFT</a></Link>
              <Link href='/profile'><a className="button button-detail">Profile</a></Link>
            </div>
            <canvas className="confetti w-0" id="canvas"></canvas>
          </div>
        </div>
      </div>
    </>
  )
}
