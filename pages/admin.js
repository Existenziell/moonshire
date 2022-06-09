import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import { getSignedUrl } from '../lib/supabase/getSignedUrl'
import { marketplaceAddress } from '../config'
import Head from 'next/head'
import Nfts from '../components/admin/Nfts'
import Collections from '../components/admin/Collections'
import Artists from '../components/admin/Artists'
import Users from '../components/admin/Users'
import SupaAuth from '../components/SupaAuth'
import GridLoader from 'react-spinners/GridLoader'
import useApp from "../context/App"

const Admin = ({ nfts, collections, artists, users, roles }) => {
  const { currentUser } = useApp()
  const [isAdmin, setIsAdmin] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    currentUser?.roles?.name === 'Admin' && setIsAdmin(true)
  }, [currentUser?.roles?.name])

  if (!session || !isAdmin) return <SupaAuth />

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
        <Users users={users} roles={roles} />
        <p className='text-xs mb-8 text-center mx-auto'>
          Contract Address: <a href={`https://rinkeby.etherscan.io/address/${marketplaceAddress}#code`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{marketplaceAddress}</a>
        </p>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

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
    props: { nfts, collections, artists, users, roles }
  }
}

export default Admin
