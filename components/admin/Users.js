import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { shortenAddress } from '../../lib/shortenAddress'
import useApp from "../../context/App"
import Search from './Search'
import Link from 'next/link'

const Users = ({ users }) => {
  const { notify } = useApp()
  const [fetchedUsers, setFetchedUsers] = useState()
  const [filteredUsers, setFilteredUsers] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFetchedUsers(users)
    setFilteredUsers(users)
  }, [users])

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
      const filteredUsers = fetchedUsers.filter(c => { return c.id !== userToDelete.id })
      setFetchedUsers(filteredUsers)
    } else {
      notify("Error...")
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedUsers) {
      if (search === '') resetSearch()
      let users = fetchedUsers.filter(u => (
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredUsers(users)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredUsers(fetchedUsers)
    setSearch('')
  }

  if (!fetchedUsers) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark'>
            <th>Avatar</th>
            <th>Wallet</th>
            <th>Username</th>
            <th>Email</th>
            <th>Created</th>
            <th>Collections</th>
            <th>NFTs</th>
            <th className='text-right w-28'>Membership</th>
            <th className='text-right w-28'>Role</th>
            <th className='text-right w-28'>Edit</th>
            <th className='text-right'>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedUsers?.length &&
            <tr className='p-4 dark:text-brand'><td>No users found.</td></tr>
          }

          {!filteredUsers?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No results
              </td>
            </tr>
          }

          {filteredUsers?.map((user) => (
            <tr key={user.id + user.username} className='relative'>

              <td>
                {user.signed_url ?
                  <img src={user.signed_url} alt='User Image' className='w-12 shadow aspect-square bg-cover' />
                  :
                  "n/a"
                }
              </td>

              <td className='whitespace-nowrap px-6'>{shortenAddress(user.walletAddress)}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td className='whitespace-nowrap'>{user.created_at.slice(0, 10)}</td>
              <td>{user.numberOfCollections}</td>
              <td>{user.numberOfNfts}</td>
              <td className='text-right w-28'>{user.is_premium ? `Premium` : `Free`}</td>
              <td className='text-right w-28'>{user.roles.name}</td>

              <td className='text-right w-28 align-middle pr-0'>
                <Link href={`/admin/users/${user.id}`}>
                  <a>
                    <button className='button-admin'>
                      Edit
                    </button>
                  </a>
                </Link>
              </td>

              <td className='text-right w-28 align-middle pr-0'>
                <button onClick={() => toggleDeleteModal(user)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
