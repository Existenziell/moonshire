import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import BackBtn from '../../../components/admin/BackBtn'
import roleOptions from '../../../lib/roleOptions'
import SupaAuth from '../../../components/SupaAuth'
import Image from 'next/image'

const User = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { notify, darkmode, currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [styles, setStyles] = useState()
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)

  async function fetchApi(...args) {
    if (!queryId) return
    const { data: user } = await supabase.from('users').select(`*, roles(*)`).eq('id', queryId).single()
    return user
  }

  const { status, data: user } = useQuery(["user", queryId], () =>
    fetchApi()
  )

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.roles?.name === 'Admin') {
        setInitializing(false)
      } else {
        router.push('/')
      }
    }
  }, [currentUser?.roles?.name])

  useEffect(() => {
    const tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  const saveUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .update({
        role: selectedRole,
      })
      .eq('id', id)

    if (!error) {
      notify("User updated successfully!")
      setLoading(false)
      router.push('/admin?view=users')
    }
  }

  if (status === "error") return <p>{status}</p>
  if (initializing || !user) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  const { id, username, walletAddress, email, avatar_url } = user

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveUser} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='edit-user flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-10'>Edit User</h1>

        <div className='flex flex-col md:flex-row gap-10 items-start justify-start'>
          <div className='shadow-2xl nextimg'>
            <Image
              width={1000}
              height={1000}
              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${avatar_url}`}
              blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${avatar_url}`}
              placeholder="blur"
              alt='User Image'
              className='rounded-sm'
            />
          </div>
          <div>
            <div>
              <h2 className='mb-2'>Username</h2>
              {username}
            </div>
            <div>
              <h2 className='mb-2 mt-8'>Email</h2>
              {email}
            </div>
            <div>
              <h2 className='mb-2 mt-8'>Wallet</h2>
              {shortenAddress(walletAddress)}
            </div>
          </div>
        </div>

        <h2 className='mt-10'>Role</h2>
        <Select
          options={roleOptions}
          onChange={(e) => setSelectedRole(e.value)}
          instanceId // Needed to prevent errors being thrown
          defaultValue={roleOptions.filter(o => o.value === user.role)}
          styles={styles}
        />

        <div className='flex items-center gap-2 mt-12'>
          <input type='submit' className='button button-cta' value='Save' disabled={loading} />
          <BackBtn href='/admin?view=users' />
        </div>
      </form>
    </div>
  )
}

export default User
