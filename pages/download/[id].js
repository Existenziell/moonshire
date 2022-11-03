import Head from "next/head"
import { useRouter } from "next/router"

export default function Download() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Head >
        <title>Download | Project Moonshire</title>
        <meta name='description' content='Download | Project Moonshire' />
      </Head>

      <div className='px-[40px] w-full'>
        <h1 className="mb-0">Download Asset</h1>
        <hr className="my-8 " />
        <div>
          ID: {id}
          <button className="button button-cta uppercase mt-8">Download</button>
        </div>
      </div>
    </>
  )
}
