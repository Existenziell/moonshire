import { supabase } from '../../lib/supabase'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const User = ({ user, nfts }) => {
  const { username, public_url } = user
  return (
    <>
      <Head>
        <title>{username} | Project Moonshire</title>
        <meta name='description' content={`${username} | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)]'>
        <div className='flex flex-col md:flex-row items-center justify-start gap-[40px] w-full'>
          <div className='w-full md:w-1/2 shadow-2xl nextimg md:max-h-[calc(100vh-200px)]'>
            <Image
              width={1000}
              height={1000}
              placeholder="blur"
              src={public_url}
              blurDataURL={public_url}
              alt='User Image'
            />
          </div>
          <div className='md:w-1/2'>
            <h1 className='mx-auto'>{username}</h1>
            <hr className='my-8' />
            {nfts.length > 0 &&
              <>
                <p className='mb-4'>Created Assets:</p>
                {nfts.map((nft, i) =>
                  i <= 16 &&
                  <Link key={nft.id} href={`/nfts/${nft.id}`}>
                    <a className='block link'>{nft.name}</a>
                  </Link>
                )}
                {nfts.length > 16 &&
                  <p>...</p>
                }
              </>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  let { data: user } = await supabase.from('users').select(`*`).eq('id', id).single()
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {}
    }
  }

  let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).eq('user', id).order('created_at', { ascending: false })
  const url = await getSignedUrl('avatars', user.avatar_url)
  user.public_url = url

  return {
    props: { user, nfts },
  }
}

export default User
