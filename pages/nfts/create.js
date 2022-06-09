import { ethers } from 'ethers'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import Select from 'react-select'
import logWeb3 from '../../lib/logWeb3'
import FilePicker from '../../components/market/FilePicker'
import uploadFileToIpfs from '../../lib/uploadFileToIpfs'
import getUserCollections from '../../lib/supabase/getUserCollections'
import { create as ipfsHttpClient } from 'ipfs-http-client'
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

    setLoading(true)
    const { name, description, price, artist, collection } = formData
    if (!name || !description || !price || !fileUrl || !artist || !collection) {
      notify("Something is missing...")
      return
    }

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
      logWeb3("Looking good, waiting for Blockchain confirmation...  ")
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

  const handleUpload = async (e) => {
    const url = await uploadFileToIpfs(e)
    setFileUrl(url)
  }

  const saveNftToDb = async (tokenId, url) => {
    if (!tokenId || !url) return

    const result = await saveNft(tokenId, url)
    if (result) {
      logWeb3(`Successfully listed NFT for Sale!`)
      notify("NFT created successfully!")
      setLoading(false)
      setTimeout(() => {
        router.push(`/nfts`)
      }, 2000)
    } else {
      notify("Something went wrong...")
    }
  }

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const setCollection = (e) => {
    setCollectionName(e.label)
    setFormData({ ...formData, ...{ collection: e.value } })
    if (artistName != '' && fileUrl) setFormIsReady(true)

  }

  const setArtist = (e) => {
    setArtistName(e.label)
    setFormData({ ...formData, ...{ artist: e.value } })
    if (collectionName != '' && fileUrl) setFormIsReady(true)
  }

  const saveNft = async (tokenId, url) => {
    const { data, error } = await supabase
      .from('nfts')
      .insert([{
        ...formData,
        image_url: fileUrl,
        tokenId,
        tokenURI: url,
        walletAddress: address,
        user: currentUser.id,
        listed: true,
      }])

    if (!error) {
      setFormData(null)
      return data
    } else {
      return false
    }
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

  const selectStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: darkmode === 'dark' ? 'var(--color-brand-dark)' : 'var(--color-brand)',
      color: darkmode === 'dark' ? 'var(--color-brand) !important' : 'var(--color-brand-dark) !important',
      border: `1px solid ${darkmode === 'dark' ? 'var(--color-detail-dark)' : 'var(--color-detail)'} !important`,
      // This line disable the blue border
      boxShadow: '0 !important'
    }),
    menuList: styles => ({
      ...styles,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        backgroundColor: darkmode === 'dark' ? 'var(--color-brand-dark)' : 'var(--color-brand)',
        color: isFocused && 'var(--color-cta)',
        cursor: 'pointer',
      }
    }
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
        <form onSubmit={createNft} className='create-nft flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
          <h1 className='mx-auto'>Create NFT</h1>

          <h1 className='mb-2'>Media</h1>
          <p className='text-tiny mb-4'>
            Image, Video, Audio, or 3D Model<br />
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB
          </p>

          <FilePicker onChange={(e) => handleUpload(e)} size={200} url={fileUrl} />
          <label htmlFor='name' className='mt-12 w-full'>
            <h1 className='mb-2'>Name</h1>
            <input
              type='text' name='name' id='name'
              onChange={setData} required
              placeholder='NFT name'
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <label htmlFor='description' className='mt-12 w-full'>
            <h1 className='mb-2'>Description</h1>
            <span className='block text-tiny mt-1'>The description will be included on the item&apos;s detail page underneath its image</span>
            <textarea
              name='description' id='description' rows={10}
              onChange={setData} required
              placeholder="Provide a detailed description of your item."
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <label htmlFor='price' className='mt-12 w-full'>
            <h1 className='mb-2'>Price</h1>
            <span className='block text-tiny mt-1'>This is the initial price, which can be adapted later for specific auctions.</span>
            <input
              type='text' name='price' id='price'
              onChange={setData} required
              placeholder='0.02 ETH'
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <label htmlFor='artist' className='mt-12 w-full'>
            <h1 className='mb-2'>Artist</h1>
            <span className='block text-tiny mt-1 mb-2'>This is the artist who will be credited for this NFT.</span>
            <Select
              options={artistOptions}
              onChange={setArtist}
              isReq={true}
              instanceId // Needed to prevent errors being thrown
              className='focus:outline-none focus:shadow-2xl dark:text-white'
              styles={selectStyles}
              disabled={loading}
            />
          </label>

          <label htmlFor='collection' className='mt-12 w-full'>
            <h1 className='mb-2'>Collection</h1>
            <span className='block text-tiny mt-1 mb-2'>This is the collection in which your item will appear.</span>
            <Select
              options={collectionOptions}
              onChange={setCollection}
              instanceId // Needed to prevent errors being thrown
              styles={selectStyles}
              disabled={loading}
            />
          </label>

          {loading ?
            <div className='flex flex-col items-start justify-center mt-10'>
              <PulseLoader color={'var(--color-cta)'} size={20} />
              <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
              <div id='mintingInfo' className='text-xs'></div>
            </div>
            :
            <input type='submit' disabled={!formIsReady} className='button button-cta mt-10' value='Create' />
          }
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
