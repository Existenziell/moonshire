import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { getSignedUrl } from '../../../lib/supabase/getSignedUrl'
import { shortenAddress } from '../../../lib/shortenAddress'
import useApp from "../../../context/App"
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import BackBtn from '../../../components/admin/BackBtn'

const User = ({ user, roles }) => {
  const { id, username, walletAddress, email, is_premium, signed_url } = user
  const { notify, darkmode } = useApp()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [premium, setPremium] = useState(false)
  const [styles, setStyles] = useState()
  const router = useRouter()

  const saveUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .update({
        is_premium: premium,
        role: selectedRole,
      })
      .eq('id', id)

    if (!error) {
      notify("User updated successfully!")
      setLoading(false)
      router.push('/admin')
    }
  }

  let roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  useEffect(() => {
    let tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  return (
    <div className='mb-20 w-full relative'>
      <BackBtn href='/admin' />

      <form onSubmit={saveUser} className='edit-user flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-10'>Edit User</h1>

        <div className='flex flex-col md:flex-row gap-10 items-start justify-start'>
          <img src={signed_url} alt='User Image' className='max-w-xs shadow-2xl rounded-sm' />

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

        <h2 className='mt-8'>Membership</h2>
        <div onChange={(e) => setPremium(e.target.value)} className='block'>
          <label htmlFor='isPremiumNo' className='cursor-pointer flex items-center gap-2'>
            <input
              type="radio" value="false"
              name='is_premium'
              id='isPremiumNo'
              defaultChecked={!is_premium}
              className='w-4 h-4 text-cta bg-gray-100 border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600'
            /> Free
          </label>
          <label htmlFor='isPremiumYes' className='cursor-pointer flex items-center gap-2'>
            <input
              type="radio" value="true"
              name='is_premium'
              id='isPremiumYes'
              defaultChecked={is_premium}
              className='w-4 h-4 text-cta bg-gray-100 border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600'
            /> Premium
          </label>
        </div>

        <h2 className='mt-10'>Role</h2>
        <Select
          options={roleOptions}
          onChange={(e) => setSelectedRole(e.value)}
          instanceId // Needed to prevent errors being thrown
          defaultValue={roleOptions.filter(o => o.value === user.role)}
          styles={styles}
        />

        <input type='submit' className='button button-cta mt-12' value='Save' disabled={loading} />
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const { data: user } = await supabase.from('users').select(`*, roles(*)`).eq('id', id).single()
  const { data: roles } = await supabase.from('roles').select(`id, name`)

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
      props: {}
    }
  }

  if (user.avatar_url) {
    const url = await getSignedUrl('avatars', user.avatar_url)
    user.signed_url = url
  }
  return {
    props: { user, roles }
  }
}

export default User
