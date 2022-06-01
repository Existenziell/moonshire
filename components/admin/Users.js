import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import { PulseLoader } from 'react-spinners'
import Select from 'react-select'

const Users = ({ users, roles }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedUsers, setFetchedUsers] = useState()
  const [formData, setFormData] = useState({})
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()

  useEffect(() => {
    setFetchedUsers(users)
  }, [users])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const setSelectData = (e) => {
    setFormData({ ...formData, ...{ role: e.value } })
  }

  const openEdit = (id) => {
    setShowEdit(true)
    const openBtn = document.getElementById(`${id}-openBtn`)
    const closeBtn = document.getElementById(`${id}-closeBtn`)
    const inputs = document.getElementsByClassName(`${id}-input`)
    const openEditBtns = document.getElementsByClassName('openBtn')
    openBtn.style.display = "none"
    closeBtn.style.display = "flex"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const closeEdit = (user) => {
    const openBtn = document.getElementById(`${user.id}-openBtn`)
    const closeBtn = document.getElementById(`${user.id}-closeBtn`)
    const inputs = document.getElementsByClassName(`${user.id}-input`)
    const openEditBtns = document.getElementsByClassName('openBtn')

    openBtn.style.display = "block"
    closeBtn.style.display = "none"
    Array.from(openEditBtns).forEach(el => (el.disabled = false))
    Array.from(inputs).forEach(el => (el.disabled = true))
    setFormData({})
  }

  const editUser = async (id) => {
    const user = fetchedUsers.filter(c => c.id === id)[0]
    const { username, email, role } = formData

    const { error } = await supabase
      .from('users')
      .update({
        username: username ? username : user.username,
        email: email ? email : user.email,
        is_premium: formData[`${id}-is_premium`] ? formData[`${id}-is_premium`] : user.is_premium,
        role: formData.role ? role : user.role,
      })
      .eq('id', id)

    if (!error) {
      notify("User updated successfully!")
      const openBtn = document.getElementById(`${id}-openBtn`)
      const closeBtn = document.getElementById(`${id}-closeBtn`)
      const inputs = document.getElementsByClassName(`${id}-input`)
      const openEditBtns = document.getElementsByClassName('openBtn')

      openBtn.style.display = "block"
      closeBtn.style.display = "none"
      Array.from(openEditBtns).forEach(el => (el.disabled = false))
      Array.from(inputs).forEach(el => (el.disabled = true))
      setFormData({})
    }
  }

  const toggleDeleteModal = (id) => {
    setUserToDelete(id)
    setShowDelete(true)
  }

  const deleteUser = async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete)

    if (!error) {
      notify("User deleted successfully!")
      setShowDelete(false)
      const filteredUsers = fetchedUsers.filter(c => { return c.id !== userToDelete })
      setFetchedUsers(filteredUsers)
    } else {
      notify("Error...")
    }
  }

  let roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  if (!fetchedUsers) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20'>
      <h2 className='mb-1'>Users</h2>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b-2 border-lines dark:border-lines-dark'>
            <th>Avatar</th>
            <th>Wallet</th>
            <th>Username</th>
            <th>Email</th>
            <th>Premium?</th>
            <th>Role</th>
            <th>Created</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedUsers?.length &&
            <tr className='p-4 dark:text-brand'><td>No users found.</td></tr>
          }

          {fetchedUsers?.map((user) => (
            <tr key={user.id + user.username} className='relative'>

              <td>
                {user.signed_url ?
                  <img src={user.signed_url} alt='User Image' className='w-12' />
                  :
                  "n/a"
                }
              </td>

              <td className='whitespace-nowrap px-6'>
                {user.walletAddress?.substring(0, 5)}&#8230;{user.walletAddress?.slice(user.walletAddress?.length - 4)}
              </td>

              <td>
                <input
                  type='text' name='username' id='username'
                  onChange={setData} disabled required
                  defaultValue={user.username}
                  className={`mr-2 ${user.id}-input`}
                />
              </td>

              <td>
                <input
                  type='text' name='email' id='email'
                  onChange={setData} disabled required
                  defaultValue={user.email}
                  className={`mr-2 ${user.id}-input`}
                />
              </td>

              <td>
                <div onChange={setData} className='block'>
                  <label htmlFor={`${user.id}-isPremiumNo`} className='cursor-pointer flex items-center gap-2'>
                    <input
                      type="radio" value="false" disabled required
                      name={`${user.id}-is_premium`}
                      id={`${user.id}-isPremiumNo`}
                      defaultChecked={!user.is_premium}
                      className={`${user.id}-input bg-white`}
                    /> No
                  </label>
                  <label htmlFor={`${user.id}-isPremiumYes`} className='cursor-pointer flex items-center gap-2'>
                    <input
                      type="radio" value="true" disabled
                      name={`${user.id}-is_premium`}
                      id={`${user.id}-isPremiumYes`}
                      defaultChecked={user.is_premium}
                      className={`${user.id}-input`}
                    /> Yes
                  </label>
                </div>
              </td>

              <td>
                <Select
                  options={roleOptions}
                  onChange={setSelectData}
                  instanceId // Needed to prevent errors being thrown
                  defaultValue={roleOptions.filter(o => o.value === user.role)}
                  isDisabled={!showEdit}
                  className='dark:text-brand-dark'
                />
              </td>

              <td className='whitespace-nowrap'>{user.created_at.slice(0, 10)}</td>

              <td className='text-center align-middle'>
                <div id={`${user.id}-closeBtn`} className='hidden items-center justify-center gap-2'>
                  <button onClick={() => editUser(user.id)} aria-label='Edit User' className='button-admin'>
                    Save
                  </button>
                  <button onClick={() => closeEdit(user)} aria-label='Close Edit Dialog' className='button-admin'>
                    Cancel
                  </button>
                </div>
                <button onClick={() => openEdit(user.id)} id={`${user.id}-openBtn`} className='openBtn button-admin' aria-label='Open Edit Dialog'>
                  Edit
                </button>
              </td>

              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(user.id)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className='text-tiny mt-2 text-right'>
        Info: New users can only be added via valid Auth flow, aka they need to connect their wallet.<br />
      </p>

      {/* Delete user */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-cta text-2xl hover:bg-gray-100'
                aria-label='Close Delete Dialog'
              >
                &times;
              </button>
              <p className='text-sm'>Deleting user with ID {userToDelete}</p>
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
