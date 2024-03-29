import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import { PlusIcon, XIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import BackBtn from '../../../components/admin/BackBtn'
import SupaAuth from '../../../components/SupaAuth'
import Image from 'next/image'
import Link from 'next/link'

const NFT = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { notify, currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [initialPhysicalAssets, setInitialPhysicalAssets] = useState([])
  const [initialDigitalAssets, setInitialDigitalAssets] = useState([])

  async function fetchApi(...args) {
    if (!queryId) return
    const { data: nft } = await supabase
      .from('nfts')
      .select(`*, artists(*), collections(*), users!nfts_user_fkey(*)`)
      .eq('id', queryId)
      .single()

    const { data: owner } = await supabase
      .from('users')
      .select(`*`)
      .eq('id', nft.owner)
      .single()

    nft.ownerName = owner?.username
    nft.ownerAddress = owner.walletAddress
    return nft
  }

  const { status, data: nft } = useQuery(["nft", queryId], () => fetchApi())

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
    if (nft?.assets) {
      let digitalAssets = []
      let physicalAssets = []
      for (let el of nft.assets) {
        el.type === 'digital' ? digitalAssets.push(el) : physicalAssets.push(el)
      }
      setInitialDigitalAssets(digitalAssets)
      setInitialPhysicalAssets(physicalAssets)
    }
  }, [nft?.assets])

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

  const calcHeight = () => (window.innerHeight - 260)

  if (status === "error") return <p>{status}</p>
  if (initializing || !nft) return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  const { id, name, description, ownerName, ownerAddress, price, tokenId, tokenURI, image_url, users, artists, collections, listed } = nft

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveNft} className='edit-nft sized-page-wrapper' autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false'>

        <div className='sized-image-wrapper'>
          <Image
            width={calcHeight()}
            height={calcHeight()}
            src={image_url}
            blurDataURL={image_url}
            placeholder="blur"
            alt='NFT Image'
          />
        </div>

        <div className='w-full md:w-1/2'>
          <div className='flex justify-between items-center relative'>
            <h1 className='mb-0'>{name}</h1>
            <DotsVerticalIcon className='w-5 hover:cursor-pointer hover:text-cta' onClick={() => setShowInfo(current => !current)} />
            {showInfo &&
              <div className='info-tab'>
                <p>TokenID: {tokenId}</p>
                <div>
                  Created by:{` `}
                  <Link href={`/users/${users.username}`}>
                    <a className='link'>{users.username}</a>
                  </Link>
                </div>
                <p>Currently listed: {listed ? `Yes` : `No`}</p>
                <p>Current owner: {shortenAddress(ownerAddress)} ({ownerName})</p>
                <p>TokenURI:{` `}
                  <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{tokenURI.slice(37, 66)}...</a>
                </p>
              </div>
            }
          </div>
          <hr className='my-9' />
          <p className='mb-8'>Description: {description}</p>
          <p className='mb-2'>Artist: {artists.name}</p>
          <p className='mb-2'>Collection: {collections.title}</p>

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
              <li id='templateDigital' className='hidden flex-col md:flex-row gap-2'>
                <input type="text" name='name' placeholder="Name" className='inputDigital' />
                <input type="text" name='link' placeholder="Link" className='inputDigital' />
                <input type="text" name='format' placeholder="Format" className='w-28 inputDigital' />
                <button onClick={removeRow}>
                  <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                </button>
              </li>

              {initialDigitalAssets.map((asset, idx) => (
                <li key={asset.name + idx} className='flex flex-col md:flex-row gap-2 digitalAsset'>
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

export default NFT
