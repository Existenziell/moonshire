import { supabase } from '../../lib/supabase'
import { useQuery } from 'react-query'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

const User = () => {
  const router = useRouter()
  const { id } = router.query
  const username = decodeURIComponent(id)

  async function fetchApi(...args) {
    if (!id) return
    let { data: user } = await supabase.from('users').select(`*`).eq('username', username).single()
    let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).eq('owner', user.id).order('created_at', { ascending: false })
    user.nfts = nfts
    return user
  }

  const { status, data: user } = useQuery(["user", username], () => fetchApi())

  if (status === "error") return <p>{status}</p>
  if (status === 'loading') return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (status === 'success' && !user) return <h1 className="mb-4 text-3xl">User not found</h1>

  const { avatar_url, assets_on_profile } = user

  return (
    <>
      <Head>
        <title>{username} | Project Moonshire</title>
        <meta name='description' content={`${username} | Project Moonshire`} />
      </Head>

      <div className='detail-page-wrapper'>
        <div className='sized-image-wrapper'>
          <Image
            width={1000}
            height={1000}
            placeholder="blur"
            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${avatar_url}`}
            blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${avatar_url}`}
            alt='User Image'
            className='rounded'
          />
        </div>
        <div className='md:w-1/2 w-full'>
          <h1 className='mx-auto'>{username}</h1>
          <hr className='my-8' />
          {user?.nfts?.length > 0 && assets_on_profile &&
            <>
              <p className='mb-4'>Owned Assets:</p>
              {user?.nfts?.map((nft, i) =>
                i <= 16 &&
                <Link key={nft.id} href={`/nfts/${nft.id}`}>
                  <a className='block link'>{nft.name}</a>
                </Link>
              )}
              {user?.nfts?.length > 16 &&
                <p>...</p>
              }
            </>
          }
        </div>
      </div>
    </>
  )
}

export default User
