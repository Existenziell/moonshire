/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import BackBtn from '../../../components/admin/BackBtn'
import getProfile from '../../../lib/supabase/getProfile'
import SupaAuth from '../../../components/SupaAuth'
import Image from 'next/image'

const NFT = ({ nft }) => {
  const { id, name, description, walletAddress, owner, price, tokenId, tokenURI, image_url, users, artists, collections, listed, assets: initialAssets } = nft

  const { notify, currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

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

  const initialPhysicalAssets = []
  const initialDigitalAssets = []
  if (initialAssets) {
    for (let el of initialAssets) {
      el.type === 'digital' ?
        initialDigitalAssets.push(el)
        :
        initialPhysicalAssets.push(el)
    }
  }

  const addRowPhysical = () => {
    const list = document.getElementById('assetsPhysical')
    const row = document.getElementById('templatePhysical')
    const newRow = row.cloneNode(true)
    const btn = newRow.lastChild
    newRow.id = Math.random()
    newRow.style.display = 'flex'
    newRow.style.marginTop = '5px'
    btn.addEventListener('click', removeRow)
    list.append(newRow)
  }

  const addRowDigital = () => {
    const list = document.getElementById('assetsDigital')
    const row = document.getElementById('templateDigital')
    const newRow = row.cloneNode(true)
    const btn = newRow.lastChild
    newRow.id = Math.round(Math.random() * 100)
    newRow.style.display = 'flex'
    newRow.style.marginTop = '5px'
    newRow.classList.add('digitalAsset')
    btn.addEventListener('click', removeRow)
    list.append(newRow)
  }

  const removeRow = (e) => {
    e.target.parentNode.remove()
  }

  const saveNft = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Create assets array
    const assets = []
    const physicalInputs = document.getElementsByClassName('inputPhysical')
    const digitalInputs = document.getElementsByClassName('digitalAsset')

    Array.from(physicalInputs).forEach(p => {
      const physicalElement = {
        type: "physical"
      }
      if (p.value === '') return
      physicalElement.name = p.value
      assets.push(physicalElement)
    })

    Array.from(digitalInputs).forEach(d => {
      const digitalElement = {
        type: "digital"
      }
      const elements = d.getElementsByTagName('input')
      Array.from(elements).forEach(i => {
        if (i.value !== '') digitalElement[i.name] = i.value
      })
      assets.push(digitalElement)
    })

    const { error } = await supabase
      .from('nfts')
      .update({
        assets
      })
      .eq('id', id)

    if (!error) {
      notify("NFT updated successfully!")
      setLoading(false)
      router.push('/admin?view=nfts')
    }
  }

  const truncate = (input) => `${input.substring(0, 22)}...${input.substring(input.length - 12, input.length)}`

  if (initializing) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveNft} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='edit-user flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>

        <div className='md:w-1/2 h-full shadow-2xl nextimg'>
          <Image
            width={1000}
            height={1000}
            src={image_url}
            blurDataURL={image_url}
            placeholder="blur"
            alt='NFT Image'
            className='aspect-square bg-cover md:max-h-[calc(100vh-260px)] md:max-w-[calc(50vw-160px)]'
          />
        </div>

        <div className='md:w-1/2'>
          <h1 className='mb-0'>{name}</h1>
          <hr className='my-9' />
          <p className='mb-8'>Description: {description}</p>
          <p className='mb-2'>Artist: {artists.name}</p>
          <p className='mb-2'>Collection: {collections.title}</p>
          {/* <p className='mb-2'>Created by: {users.username}</p> */}
          {/* <p className='mb-2'>TokenID: {tokenId}</p> */}
          {/* <p className='mb-2'>Currently listed: {listed ? `Yes` : `No`}</p> */}
          {/* <p className='mb-2'>Current owner: {shortenAddress(walletAddress)} ({owner})</p> */}
          {/* <p className='mb-2 whitespace-nowrap'>TokenURI: <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{truncate(tokenURI)}</a></p> */}

          <div className='mt-16'>
            <h1 className='mb-0'>Assets</h1>
            <hr className='my-8' />

            <div className='flex items-center gap-6 mb-4'>
              <p>Physical</p>
              <PlusIcon className='w-5 h-5 hover:cursor-pointer hover:text-cta' onClick={addRowPhysical} />
            </div>
            <ul id='assetsPhysical'>
              <li id='templatePhysical' className='hidden'>
                <input type="text" name='name' placeholder="Name" className='mr-4 inputPhysical' />
                <button onClick={removeRow}>
                  <XIcon className='w-5 h-5 hover:text-cta hover:bg-cta pointer-events-none' />
                </button>
              </li>
              {initialPhysicalAssets.map((asset, idx) => (
                <li key={asset.name + idx} className='mb-1'>
                  <input type="text" name='name' placeholder="Name" className='mr-4 inputPhysical' defaultValue={asset.name} />
                  <button onClick={removeRow}>
                    <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                  </button>
                </li>
              ))}
            </ul>

            <div className='flex items-center gap-6 mt-10 mb-4'>
              <p>Digital</p>
              <PlusIcon className='w-5 h-5 hover:cursor-pointer hover:text-cta' onClick={addRowDigital} />
            </div>
            <ul id='assetsDigital'>
              <li id='templateDigital' className='hidden gap-2'>
                <input type="text" name='name' placeholder="Name" className='inputDigital' />
                <input type="text" name='link' placeholder="Link" className='inputDigital' />
                <input type="text" name='format' placeholder="Format" className='w-28 inputDigital' />
                <button onClick={removeRow}>
                  <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                </button>
              </li>

              {initialDigitalAssets.map((asset, idx) => (
                <li key={asset.name + idx} className='flex gap-2 digitalAsset'>
                  <input type="text" name='name' placeholder="Name" className='inputDigital' defaultValue={asset.name} />
                  <input type="text" name='link' placeholder="Link" className='inputDigital' defaultValue={asset.link} />
                  <input type="text" name='format' placeholder="Format" className='w-28 inputDigital' defaultValue={asset.format} />
                  <button onClick={removeRow}>
                    <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex items-center gap-10 mt-10'>
            <p className='my-0 text-[20px] leading-none h-full'>{price} ETH</p>
            <div className='flex items-center gap-2'>
              <input type='submit' className='button button-cta' value='Save' disabled={loading} />
              <BackBtn href='/admin?view=nfts' />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id

  const { data: nft } = await supabase
    .from('nfts')
    .select(`*, artists(*), collections(*), users(*)`)
    .eq('id', id)
    .single()

  if (!nft) {
    return {
      redirect: {
        permanent: false,
        destination: "/nfts",
      },
      props: {}
    }
  }

  const owner = await getProfile(nft.walletAddress)
  nft.owner = owner.username

  return {
    props: { nft },
  }
}

export default NFT
