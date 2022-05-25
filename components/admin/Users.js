import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import Select from 'react-select'

const Users = ({ users, roles }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedUsers, setFetchedUsers] = useState()
  const [formData, setFormData] = useState({})
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()

  const router = useRouter()

  useEffect(() => {
    setFetchedUsers(users)
  }, [users])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ role: e.value } })
  }

  const openEdit = (id) => {
    setShowEdit(true)
    const openBtn = document.getElementById(`${id}-openBtn`)
    const closeBtn = document.getElementById(`${id}-closeBtn`)
    const inputs = document.getElementsByClassName(`${id}-input`)
    const openEditBtns = document.getElementsByClassName('openBtn')
    openBtn.style.display = "none"
    closeBtn.style.display = "block"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const editUser = async (id) => {
    const user = fetchedUsers.filter(c => c.id === id)[0]
    const { username, role } = formData

    const { error } = await supabase
      .from('users')
      .update({
        username: username ? username : user.username,
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

  return (
    <div className='py-8 text-left'>
      <h1 className='max-w-max px-6 py-3 mb-1 text-brand bg-brand-dark dark:text-brand-dark dark:bg-brand'>Users</h1>

      <table className='shadow-lg bg-white text-brand-dark text-sm table-auto w-full'>
        <thead>
          <tr className='bg-brand text-brand-dark dark:text-brand-dark font-bold'>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Premium?</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedUsers?.length &&
            <tr className='p-4'><td>No users found.</td></tr>
          }

          {fetchedUsers?.map((user, idx) => (
            <tr key={user.id + user.username} className={`relative anchor ${idx % 2 !== 0 && `bg-slate-100`}`}>
              <td>{`${user.id.slice(0, 4)}...${user.id.slice(-4)}`}</td>
              <td>
                <input
                  type='text' name='username' id='username'
                  onChange={setData} disabled required
                  defaultValue={user.username}
                  className={`mr-2 ${user.id}-input`}
                />
              </td>
              <td>{user.email ? `${user.email?.slice(0, 14)}...` : ``}</td>
              <td>
                <div onChange={setData} className='block'>
                  <label htmlFor={`${user.id}-isPremiumNo`} className='cursor-pointer block'>
                    <input
                      type="radio" value="false" disabled required
                      name={`${user.id}-is_premium`}
                      id={`${user.id}-isPremiumNo`}
                      defaultChecked={!user.is_premium}
                      className={`${user.id}-input`}
                    /> No
                  </label>
                  <label htmlFor={`${user.id}-isPremiumYes`} className='cursor-pointer'>
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
                />
              </td>
              <td className='flex items-center justify-center gap-2 mt-2'>

                <div id={`${user.id}-closeBtn`} className='hidden'>
                  <button onClick={() => editUser(user.id)} aria-label='Edit User'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-green-700 hover:scale-110 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={() => router.reload(window.location.pathname)} aria-label='Cancel'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-red-700 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <button onClick={() => openEdit(user.id)} id={`${user.id}-openBtn`} className='openBtn' aria-label='Open Edit Dialog'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>

              </td>
              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(user.id)} aria-label='Toggle Delete Modal'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className='text-xs mt-2 text-right'>
        New users can only be added via valid Auth flow, aka they need to create a new account.<br />
        The email is connected to auth.user and cannot be changed.
      </p>

      {/* Delete user */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button onClick={() => setShowDelete(false)} className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100' aria-label='Close Delete Dialog'>
                &times;
              </button>
              <p className='text-sm'>Deleting user with ID {userToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteUser} className='hover:text-brand hover:underline' aria-label='Yes'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Users
