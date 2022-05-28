import Link from 'next/link'
import Head from 'next/head'

const Success = () => {
  return (
    <>
      <Head>
        <title>Success | Project Moonshire</title>
        <meta name='description' content="Success | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center'>
        <Link href='/'>
          <a>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-32 w-32 hover:scale-105 transition-all' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
            </svg>
          </a>
        </Link>
        <h1>Success!</h1>

        <div className='flex'>
          <Link href='/'><a className='button button-detail mr-6'>Back Home</a></Link>
          <Link href='/collection'><a className='button button-detail'>Collection</a></Link>
        </div>

      </div>
    </>
  )
}

export default Success
