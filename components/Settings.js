import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { addToMetamask } from '../lib/addToMetamask'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import useApp from "../context/App"
import Head from 'next/head'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/supabase/updateProfile'

const Settings = () => {
  const { currentUser, setCurrentUser, disconnect, notify } = useApp()
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [modified, setModified] = useState(false)
  const [assetsOnProfile, setAssetsOnProfile] = useState()
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    if (currentUser) {
      const { username, avatar_url, assets_on_profile } = currentUser
      setUsername(username)
      setAvatarUrl(avatar_url)
      setAssetsOnProfile(assets_on_profile)
    }
  }, [currentUser])

  const setUser = (e) => {
    const username = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "")
    setUsername(username)
    setModified(true)
  }

  const updateUser = () => {
    setModified(false)
    setCurrentUser(currentUser => ({
      ...currentUser,
      ...{ username }
    }))
    updateProfile({ id: currentUser.id, username, avatar_url, notify })
  }

  const resetInput = () => {
    setUsername(currentUser.username)
    setModified(false)
  }

  const handleUpload = (url) => {
    setAvatarUrl(url)
    setCurrentUser(currentUser => ({
      ...currentUser,
      ...{ avatar_url: url }
    }))
    updateProfile({ id: currentUser.id, username, avatar_url: url, notify })
  }

  const savePublicAssetState = async (value) => {
    const { error } = await supabase
      .from('users')
      .update({
        assets_on_profile: value
      })
      .eq('id', currentUser.id)

    if (!error) {
      notify("Profile updated successfully!", 1500)
    }
  }

  return (
    <>
      <Head>
        <title>Settings | Project Moonshire</title>
        <meta name='description' content='Settings | Project Moonshire' />
      </Head>

      <div className='profile flex flex-col items-center justify-start w-full pb-24'>
        <div className='flex flex-col items-center justify-start md:flex-row gap-[40px] w-full'>
          <div className='w-full md:w-1/2 md:max-w-[400px]'>
            <Avatar
              url={avatar_url}
              onUpload={(url) => handleUpload(url)}
            />
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-col md:items-start justify-start w-full'>
              <label htmlFor="username">
                <input
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUser(e)}
                  placeholder='Username'
                  className='text-4xl md:text-6xl text-left font-serif w-full ring-0 border-0 relative -left-4'
                />
              </label>
              {modified &&
                <div className='flex flex-row items-center gap-2 mt-2'>
                  <button onClick={updateUser} className='link text-xs'>Save</button>
                  <button onClick={resetInput} className='link text-xs ml-1'>Cancel</button>
                </div>
              }
              <hr className='mt-6 w-full' />

              <div className='flex justify-between items-center relative w-full mt-12 mb-4'>
                <h2>Preferences</h2>
                <DotsVerticalIcon className='w-5 hover:cursor-pointer hover:text-cta' onClick={() => setShowInfo(current => !current)} />
                {showInfo &&
                  <div className='info-tab'>
                    <button onClick={addToMetamask} className='button button-detail'>Add MOON to Metamask</button>
                    <button className='button button-detail' onClick={disconnect}>Logout</button>
                  </div>
                }
              </div>
              <div>
                <label htmlFor="assetsOnProfile" className="cursor-pointer flex items-center">
                  <input
                    type="checkbox"
                    id="assetsOnProfile"
                    defaultChecked={assetsOnProfile}
                    onChange={(e) => savePublicAssetState(e.target.checked)}
                  />
                  <span className='pl-4'>Show assets on your {` `}
                    <Link href={`/users/${encodeURIComponent(currentUser.username)}`}>
                      <a className='link-white'>public profile</a>
                    </Link>
                  </span>
                </label>

                <div className='self-start mt-8'>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
