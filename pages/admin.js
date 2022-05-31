import { useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Users from '../components/admin/Users'
import Artists from '../components/admin/Artists'
import SupaAuth from '../components/SupaAuth'
import GridLoader from 'react-spinners/GridLoader'

const Admin = ({ users, artists, roles }) => {
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
        <h1 className='mb-1 mx-auto'>Admin</h1>
        <p className='mb-4 mx-auto text-tiny'>Remember, with great power comes great responsibility.</p>
        <Users users={users} roles={roles} />
        <Artists artists={artists} users={users} />
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  return {
    props: { users, artists, roles },
  }
}

export default Admin
