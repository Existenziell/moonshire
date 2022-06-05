import { useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AppContext } from '../context/AppContext'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import { getSignedUrl } from '../lib/supabase/getSignedUrl'
import Head from 'next/head'
import Nfts from '../components/admin/Nfts'
import Collections from '../components/admin/Collections'
import Artists from '../components/admin/Artists'
import Users from '../components/admin/Users'
import SupaAuth from '../components/SupaAuth'
import GridLoader from 'react-spinners/GridLoader'

const Admin = ({ nfts, collections, artists, users, roles }) => {
  const appCtx = useContext(AppContext)
  const { session, currentUser } = appCtx
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    currentUser?.roles?.name === 'Admin' && setIsAdmin(true)
  }, [currentUser?.roles?.name])

  if (!currentUser) return <div className='flex items-center justify-center'><GridLoader color={'var(--color-cta)'} size={40} /></div>
  if (!session || !isAdmin) return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Project Moonshire</title>
        <meta name='description' content="Admin | Project Moonshire" />
      </Head>

      <div className='admin flex flex-col items-start'>
        <p className='mb-20 mx-auto text-xs'>Remember, with great power comes great responsibility.</p>
        <Nfts nfts={nfts} />
        <Collections collections={collections} />
        <Artists artists={artists} collections={collections} />
        <Users users={users} roles={roles} />
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
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    collection.numberOfNfts = collectionNfts.length
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
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
