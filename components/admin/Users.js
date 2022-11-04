import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import { shortenAddress } from '../../lib/shortenAddress'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
import useApp from "../../context/App"
import Search from './Search'
// import Link from 'next/link'
import Select from 'react-select'
import selectStyles from '../../lib/selectStyles'
import roleOptions from '../../lib/roleOptions'
import Image from 'next/image'

const Users = () => {
  const { notify, darkmode } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()
  const [search, setSearch] = useState('')
  const [styles, setStyles] = useState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function fetchApi(...args) {
    let { data: users } = await supabase
      .from('users')
      .select(`*, roles(*)`)
      .ilike('username', `%${search}%`)
      .order('created_at', { ascending: false })

    let { data: collections } = await supabase
      .from('collections')
      .select(`*`)
      .order('created_at', { ascending: false })

    let { data: nfts } = await supabase
      .from('nfts')
      .select(`*, artists(*), collections(*)`)
      .order('created_at', { ascending: false })

    for (let user of users) {
      if (user.avatar_url) {
        const url = await getSignedUrl('avatars', user.avatar_url)
        user.signed_url = url
      }
      const userCollections = collections.filter(c => (c.user === user.id))
      const userNfts = nfts.filter(nft => (nft.user === user.id))
      user.numberOfCollections = userCollections.length
      user.numberOfNfts = userNfts.length
    }
    return users
  }

  const { status, data: users } = useQuery(["users", search], () =>
    fetchApi()
  )

  useEffect(() => {
    const tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  const toggleDeleteModal = (user) => {
    setUserToDelete(user)
    setShowDelete(true)
  }

  const deleteUser = async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.id)

    if (!error) {
      notify("User deleted successfully!")
      setShowDelete(false)
      router.reload()
    } else {
      notify("Error...")
    }
  }

  const saveUser = async (id, value) => {
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .update({
        role: value,
      })
      .eq('id', id)

    if (!error) {
      notify("User updated successfully!", 1500)
      setLoading(false)
    }
  }

  if (status === "error") return <p>{status}</p>
  if (status === 'success' & !users) return <h1 className="mb-4 text-3xl">No users found</h1>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={() => setSearch('')} />

      {status === 'loading' ?
        <div className='flex items-center justify-center min-w-max h-[calc(100vh-420px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
        :
        <table className='table-auto w-full'>
          <thead className='text-left'>
            <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
              <th className='relative -left-2'>Avatar</th>
              <th>Wallet</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created</th>
              <th>Collections</th>
              <th>NFTs</th>
              <th className='text-right'>Role</th>
              <th className='text-right w-28'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.length <= 0 ?
              <tr className="flex flex-col items-start"><td>No results</td></tr>
              :
              users?.map((user) => (
                <tr key={user.id + user.username} className='relative'>
                  <td className='px-0 w-[80px]'>
                    {user.signed_url ?
                      <Image
                        width={60}
                        height={60}
                        placeholder="blur"
                        src={user.signed_url}
                        blurDataURL={user.signed_url}
                        alt='User Image'
                        className='w-[60px] shadow aspect-square bg-cover'
                      />
                      :
                      "n/a"
                    }
                  </td>
                  <td className='whitespace-nowrap'>{shortenAddress(user.walletAddress)}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className='whitespace-nowrap'>{user.created_at.slice(0, 10)}</td>
                  <td>{user.numberOfCollections}</td>
                  <td>{user.numberOfNfts}</td>
                  <td className='text-right'>
                    <Select
                      options={roleOptions}
                      onChange={(e) => saveUser(user.id, e.value)}
                      instanceId // Needed to prevent errors being thrown
                      defaultValue={roleOptions.filter(o => o.value === user.role)}
                      styles={styles}
                      disabled={loading}
                    />
                  </td>
                  <td className='text-right align-middle w-28 pr-0'>
                    <button onClick={() => toggleDeleteModal(user)} aria-label='Toggle Delete Modal' className='button-admin'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      }

      {/* Delete user */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-cta text-2xl'
                aria-label='Close Delete Dialog'
              >
                &times;
              </button>
              <p className='text-sm mb-4'>Deleting user {userToDelete.username}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteUser} className='button button-detail' aria-label='Yes'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Users
