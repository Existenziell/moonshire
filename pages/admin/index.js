import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
import { marketplaceAddress } from '../../config'
import Head from 'next/head'
import Nfts from '../../components/admin/Nfts'
import Collections from '../../components/admin/Collections'
import Artists from '../../components/admin/Artists'
import Users from '../../components/admin/Users'
import SupaAuth from '../../components/SupaAuth'
import useApp from "../../context/App"
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

const Admin = ({ nfts, collections, artists, users }) => {
  const { currentUser } = useApp()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.roles?.name === 'Admin') {
        setLoading(false)
      } else {
        router.push('/')
      }
    }
  }, [currentUser?.roles?.name])

  if (loading) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!session) return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Project Moonshire</title>
        <meta name='description' content="Admin | Project Moonshire" />
      </Head>

      <div className='admin flex flex-col items-start px-[40px]'>
        <Nfts nfts={nfts} />
        <Collections collections={collections} />
        <Artists artists={artists} collections={collections} />
        <Users users={users} />
        <p className='text-xs mb-8 text-center mx-auto'>
          Contract Address: <a href={`https://rinkeby.etherscan.io/address/${marketplaceAddress}#code`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{marketplaceAddress}</a>
        </p>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('created_at', { ascending: false })
  const { data: collections } = await supabase.from('collections').select(`*`).order('created_at', { ascending: false })
  const { data: artists } = await supabase.from('artists').select(`*`).order('created_at', { ascending: false })
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('username', { ascending: true })

  for (let artist of artists) {
    const artistNfts = nfts.filter((n => n.artist === artist.id))
    artist.numberOfNfts = artistNfts.length
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url
  }

  for (let collection of collections) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url

    if (nfts) {
      const collectionNfts = nfts.filter((n => n.collection === collection.id))
      collection.numberOfNfts = collectionNfts.length
    } else {
      collection.numberOfNfts = 0
    }
  }

  for (let user of users) {
    if (user.avatar_url) {
      const url = await getSignedUrl('avatars', user.avatar_url)
      user.signed_url = url
    }
  }

  return {
    props: { nfts, collections, artists, users }
  }
}

export default Admin
