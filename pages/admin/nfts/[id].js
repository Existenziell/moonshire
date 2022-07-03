/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import useApp from "../../../context/App"
import BackBtn from '../../../components/admin/BackBtn'
import getProfile from '../../../lib/supabase/getProfile'
import fromExponential from 'from-exponential'
import SupaAuth from '../../../components/SupaAuth'
import { PulseLoader } from 'react-spinners'

const NFT = ({ nft }) => {
  const { id, name, description, walletAddress, owner, price, tokenId, tokenURI, image_url, users, artists, collections, listed, featured, assets: initialAssets } = nft

  const { notify, currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)

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

  let initialPhysicalAssets = []
  let initialDigitalAssets = []
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
    let assets = []
    const physicalInputs = document.getElementsByClassName('inputPhysical')
    const digitalInputs = document.getElementsByClassName('digitalAsset')

    Array.from(physicalInputs).forEach(p => {
      let physicalElement = {
        type: "physical"
      }
      if (p.value === '') return
      physicalElement.name = p.value
      assets.push(physicalElement)
    })

    Array.from(digitalInputs).forEach(d => {
      let digitalElement = {
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
        featured: isFeatured,
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

  if (initializing) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!session) return <SupaAuth />

  return (
    <div className='mb-20 w-full relative'>
      <BackBtn href='/admin?view=nfts' />

      <form onSubmit={saveNft} className='edit-user flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>

        <div className='md:w-1/2 h-full'>
          <img src={image_url} alt='NFT Image' className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)]' />
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

          <label htmlFor="featured" className="cursor-pointer flex items-center whitespace-nowrap mt-10">
            <input
              id="featured"
              type="checkbox"
              defaultChecked={featured}
              onChange={() => setIsFeatured(!featured)}
              className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
              disabled={loading || !listed} />
            <span className=' relative bottom-[1px] ml-2'>Featured</span>
          </label>
          {!listed && <span className='text-tiny'>This NFT is currently not listed and therefore can not be set as featured.</span>}

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
                <button onClick={removeRow} className=''>
                  <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                </button>
              </li>
              {initialPhysicalAssets.map((asset, idx) => (
                <li key={asset.name + idx}>
                  <input type="text" name='name' placeholder="Name" className='mr-4 inputPhysical' defaultValue={asset.name} />
                  <button onClick={removeRow} className=''>
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
                <button onClick={removeRow} className=''>
                  <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                </button>
              </li>
              {initialDigitalAssets.map((asset, idx) => (
                <li key={asset.name + idx} className='flex gap-2 digitalAsset'>
                  <input type="text" name='name' placeholder="Name" className='inputDigital' defaultValue={asset.name} />
                  <input type="text" name='link' placeholder="Link" className='inputDigital' defaultValue={asset.link} />
                  <input type="text" name='format' placeholder="Format" className='w-28 inputDigital' defaultValue={asset.format} />
                  <button onClick={removeRow} className=''>
                    <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex items-center gap-10 mt-10'>
            <p className='my-0 text-[30px] leading-none h-full'>{fromExponential(price)} ETH</p>
            <input type='submit' className='button button-cta' value='Save' disabled={loading} />
          </div>
        </div>
      </form>
    </div>
  )
}


export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: nft } = await supabase
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
