import { ethers } from 'ethers'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import Select from 'react-select'
import selectStyles from '../../lib/selectStyles'
import logWeb3 from '../../lib/logWeb3'
import FilePicker from '../../components/market/FilePicker'
import uploadFileToIpfs from '../../lib/uploadFileToIpfs'
import getUserCollections from '../../lib/supabase/getUserCollections'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { marketplaceAddress } from '../../config'

const CreateNft = ({ artists }) => {
  const { address, signer, currentUser, darkmode, hasMetamask, notify, checkChain, chainId } = useApp()

  const [fileUrl, setFileUrl] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userCollections, setUserCollections] = useState([])
  const [fetching, setFetching] = useState(true)
  const [artistName, setArtistName] = useState('')
  const [collectionName, setCollectionName] = useState('')
  const [formIsReady, setFormIsReady] = useState(false)
  const [styles, setStyles] = useState()

  const router = useRouter()
  const ipfsUrl = 'https://ipfs.infura.io/ipfs/'

  useEffect(() => {
    if (currentUser && address) {
      fetchUserCollections()
    }
  }, [currentUser, address])

  const fetchUserCollections = async () => {
    const userCollections = await getUserCollections(currentUser.id)
    currentUser.collections = userCollections
    setUserCollections(userCollections)
    setFetching(false)
  }

  const handleUpload = async (e) => {
    const url = await uploadFileToIpfs(e)
    setFileUrl(url)
  }

  const uploadMetadataToIpfs = async () => {
    const { name, description, price } = formData
    const data = JSON.stringify({
      name,
      description,
      price,
      image: fileUrl,
      artist: artistName,
      collection: collectionName,
    })

    try {
      const added = await client.add(data)
      const url = ipfsUrl + added.path
      /* After file-upload to IPFS, return the Metadata-URL to use in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const createNft = async (e) => {
    e.preventDefault()

    if (!checkChain(chainId)) {
      notify('Please change network to Rinkeby in Metamask.')
      return
    }

    const { name, description, price, artist, collection } = formData
    if (!name || !description || !price || !fileUrl || !artist || !collection) {
      notify("Something is missing...")
      return
    }
    setLoading(true)

    logWeb3(`Uploading Metadata to IPFS...`)
    const url = await uploadMetadataToIpfs()
    if (url) {
      logWeb3(`Successfully uploaded to ${url}`)
      listNFTForSale(url)
    }
  }

  const listNFTForSale = async (url) => {
    logWeb3("Creating Asset on Blockchain...")
    const price = ethers.utils.parseUnits(formData.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    try {
      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()
      logWeb3("Looking good, waiting for Blockchain confirmation")
      contract.on("MarketItemCreated", (tokenId) => {
        tokenId = parseInt(tokenId)
        logWeb3(`Item ${tokenId} successfully created!`)
        logWeb3(`CreateToken Transaction Hash: ${transaction.hash}`)
        saveNftToDb(tokenId, url)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const saveNftToDb = async (tokenId, url) => {
    if (!tokenId || !url) return

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

    // Save all to DB
    const { error } = await supabase
      .from('nfts')
      .insert([{
        ...formData,
        image_url: fileUrl,
        tokenId,
        tokenURI: url,
        walletAddress: address,
        user: currentUser.id,
        listed: true,
        assets
      }])

    if (!error) {
      logWeb3(`Successfully listed NFT for Sale!`)
      notify("NFT created successfully!")
      setLoading(false)
      setFormData(null)
      setTimeout(() => {
        router.push(`/success-nft?tokenURI=${url}&name=${formData.name}&image_url=${fileUrl}`)
      }, 2000)
    } else {
      notify("Something went wrong...")
    }
  }

  const checkForm = () => {
    (fileUrl && formData?.name && formData?.description && formData?.price && artistName != '' && collectionName != '')
      ?
      setFormIsReady(true)
      :
      setFormIsReady(false)
  }

  useEffect(() => {
    checkForm()
  }, [formData, fileUrl, collectionName, artistName])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const setCollection = (e) => {
    setCollectionName(e.label)
    setFormData({ ...formData, ...{ collection: e.value } })
  }

  const setArtist = (e) => {
    setArtistName(e.label)
    setFormData({ ...formData, ...{ artist: e.value } })
  }

  let artistOptions = []
  artists.forEach(a => {
    artistOptions.push({ value: a.id, label: a.name })
  })

  let collectionOptions = []
  if (userCollections) {
    userCollections.forEach(c => {
      collectionOptions.push({ value: c.id, label: c.title })
    })
  }

  useEffect(() => {
    let tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  const addRowPhysical = () => {
    const list = document.getElementById('assetsPhysical')
    const row = document.getElementById('templatePhysical')
    const newRow = row.cloneNode(true)
    const btn = newRow.lastChild
    newRow.id = Math.random()
    newRow.style.display = 'flex'
    newRow.style.marginBottom = '5px'
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
    newRow.style.marginBottom = '5px'
    newRow.classList.add('digitalAsset')
    btn.addEventListener('click', removeRow)
    list.append(newRow)
  }

  const removeRow = (e) => {
    e.target.parentNode.remove()
  }

  if (!hasMetamask) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please install Metamask to proceed.
      </p>
    )
  }

  if (!address) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please connect your wallet to proceed.
      </p>
    )
  }

  if (fetching) {
    return (
      <div className='flex flex-col gap-2 items-center justify-center'>
        <PulseLoader color={'var(--color-cta)'} size={20} />
        <p className='text-xs'>Gathering required information...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Create NFT | Project Moonshire</title>
        <meta name='description' content="Create NFT | Project Moonshire" />
      </Head>

      {!userCollections?.length ?

        <div className='flex flex-col items-center justify-center mt-8 text-center px-[40px]'>
          <h2>Please create a collection first</h2>
          <p className='text-sm'>Every NFT needs to be connected to a collection.</p>
          <Link href='/collections/create'>
            <a className='button button-detail mt-8'>
              Create Collection
            </a>
          </Link>
        </div>
        :
        <form onSubmit={createNft} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='create-nft flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
          <div className='w-full h-full md:w-1/2'>
            <FilePicker onChange={(e) => handleUpload(e)} url={fileUrl} />
          </div>

          <div className='md:w-1/2'>
            <label htmlFor='name' className='mt-12 w-full'>
              <input
                type='text' name='name' id='name'
                onChange={setData} required
                placeholder='Name'
                className='block mt-2 w-full text-[20px] md:text-[30px]'
                disabled={loading}
              />
            </label>
            <hr className='my-8' />

            <label htmlFor='description' className='mt-12 w-full'>
              <textarea
                name='description' id='description' rows={4}
                onChange={setData} required
                placeholder="Description"
                className='block mt-2 w-full'
                disabled={loading}
              />
            </label>

            <div className='flex items-center justify-between gap-8 mt-4'>
              <div className='w-1/2'>
                <p className='mb-2 ml-5'>Artist</p>
                <label htmlFor='artist' className='w-full'>
                  <Select
                    options={artistOptions}
                    onChange={setArtist}
                    isReq={true}
                    instanceId // Needed to prevent errors being thrown
                    styles={styles}
                    disabled={loading}
                  />
                </label>
              </div>
              <div className='w-1/2'>
                <p className='mb-2 ml-5'>Collection</p>
                <label htmlFor='collection' className='w-full'>
                  <Select
                    options={collectionOptions}
                    onChange={setCollection}
                    instanceId // Needed to prevent errors being thrown
                    styles={styles}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <label htmlFor='price' className='mt-4 w-full flex items-center gap-8'>
              <input
                type='text' name='price' id='price'
                onChange={setData} required
                placeholder='Price'
                className='block w-1/4'
                disabled={loading}
              />ETH
            </label>

            <div className='mt-16 ml-4'>
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
              </ul>

              <div className='flex items-center gap-6 my-4'>
                <p>Digital</p>
                <PlusIcon className='w-5 h-5 hover:cursor-pointer hover:text-cta' onClick={addRowDigital} />
              </div>
              <ul id='assetsDigital'>
                <li id='templateDigital' className='hidden gap-4'>
                  <input type="text" name='name' placeholder="Name" className='inputDigital' />
                  <input type="text" name='link' placeholder="Link" className='inputDigital' />
                  <input type="text" name='format' placeholder="Format" className='w-28 inputDigital' />
                  <button onClick={removeRow} className=''>
                    <XIcon className='w-5 h-5 hover:text-cta pointer-events-none' />
                  </button>
                </li>
              </ul>
            </div>

            {loading ?
              <div className='flex flex-col items-start justify-center mt-10'>
                <PulseLoader color={'var(--color-cta)'} size={20} />
                <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                <div id='mintingInfo' className='text-xs'></div>
              </div>
              :
              <input type='submit' value='Create' disabled={!formIsReady} className='button button-cta my-12 ml-4' />
            }
          </div>
        </form>
      }
    </>
  )
}

export async function getServerSideProps() {
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })

  return {
    props: { artists },
  }
}

export default CreateNft
