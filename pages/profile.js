import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/updateProfile'
import SupaAuth from '../components/SupaAuth'

const Profile = () => {
  const appCtx = useContext(AppContext)
  const { session, notify, currentUser } = appCtx

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setRole(currentUser.role)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
    }
  }, [currentUser])

  if (!session || !currentUser) return <SupaAuth />

  return (
    <>
      <Head>
        <title>Profile | Project Moonshire</title>
        <meta name='description' content='Profile | Project Moonshire' />
      </Head>

      <div className='px-8 profile'>
        <h1 className='text-4xl md:text-6xl mb-12 mt-4'>Profile</h1>

        <h2>{username}</h2>
        <p className='text-tiny'>Joined: {createdAt?.slice(0, 10)}</p>
        <p className='text-tiny'>Member status: {is_premium ? `Premium` : `Free`}</p>

        <div className='w-1/3'>
          <Avatar
            url={avatar_url}
            // size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ username, email, role, avatar_url: url, setLoading, notify })
            }}
          />
        </div>

        <div className="mt-8 text-left shadow max-w-max bg-slate-300 p-4">
          <h2 className='font-bold text-xl mb-4'>Edit:</h2>
          <div>
            <label htmlFor="username" className='block text-xs mt-2'>Username</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className='block text-xs mt-2'>Email</label>
            <input
              disabled
              id="email"
              type="text"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              className="link mt-6 text-xl"
              onClick={() => updateProfile({ username, avatar_url, setLoading, notify })}
              disabled={loading}
              aria-label='Update Profile'
            >
              {loading ? 'Loading ...' : 'Save'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

export default Profile
