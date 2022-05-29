import { useContext } from 'react'
import { supabase } from '../lib/supabase'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Users from '../components/admin/Users'
import Artists from '../components/admin/Artists'
import SupaAuth from '../components/SupaAuth'

const Admin = ({ users, artists, roles }) => {
  const appCtx = useContext(AppContext)
  const { session, currentUser } = appCtx

  if (!session) return <SupaAuth />
  if (currentUser?.roles?.name !== 'Admin') return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Project Moonshire</title>
        <meta name='description' content="Admin | Project Moonshire" />
      </Head>

      <div className='admin flex flex-col items-start'>
        <h1 className='mb-1'>Admin</h1>
        <p className='mb-4'>Remember, with great power comes great responsibility.</p>
        <Users users={users} roles={roles} />
        <Artists artists={artists} users={users} />
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  return {
    props: { users, artists, roles },
  }
}

export default Admin
