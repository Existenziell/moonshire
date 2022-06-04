import { ethers } from 'ethers'
import { supabase } from '../../lib/supabase'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core"
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Select from 'react-select'
import logWeb3 from '../../lib/logWeb3'
import FilePicker from '../../components/market/FilePicker'
import uploadFileToIpfs from '../../lib/uploadFileToIpfs'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  marketplaceAddress
} from '../../config'

const CreateNft = ({ artists, collections }) => {
  const appCtx = useContext(AppContext)
  const { currentUser, notify, checkChain, hasMetamask, darkmode } = appCtx

  const { account, chainId, library: provider } = useWeb3React()

  const [fileUrl, setFileUrl] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const [artistName, setArtistName] = useState('')
  const [collectionName, setCollectionName] = useState('')

  const router = useRouter()
  const ipfsUrl = 'https://ipfs.infura.io/ipfs/'

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
      logWeb3(`Upload successful! ${url}`)
      listNFTForSale(url)
    }
  }

  const listNFTForSale = async (url) => {
    logWeb3("Creating Asset on Blockchain...")
    const signer = provider.getSigner()
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
        router.push('/profile')
      }, 3000)

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
  }

  const setArtist = (e) => {
    setArtistName(e.label)
    setFormData({ ...formData, ...{ artist: e.value } })
  }

  const saveNft = async (tokenId, url) => {
    const { data, error } = await supabase
      .from('nfts')
      .insert([{
        ...formData,
        image_url: fileUrl,
        tokenId,
        tokenURI: url,
        walletAddress: account,
        user: currentUser.id,
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
  collections.forEach(c => {
    collectionOptions.push({ value: c.id, label: c.title })
  })

  const selectStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: darkmode ? 'var(--color-brand-dark)' : 'var(--color-brand)',
      color: darkmode ? 'var(--color-brand) !important' : 'var(--color-brand-dark) !important',
      border: `1px solid ${darkmode ? 'var(--color-detail-dark)' : 'var(--color-detail)'} !important`,
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
        backgroundColor: darkmode ? 'var(--color-brand-dark)' : 'var(--color-brand)',
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

  if (!account) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please connect your wallet first.
      </p>
    )
  }

  return (
    <>
      <Head>
        <title>Create NFT | Project Moonshire</title>
        <meta name='description' content="Create NFT | Project Moonshire" />
      </Head>

      <form className='create-nft flex flex-col items-start max-w-2xl mx-auto pb-24'>
        <h1 className='mx-auto'>Create NFT</h1>

        <p>Image, Video, Audio, or 3D Model</p>
        <p className='text-tiny mb-4'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>

        <FilePicker onChange={(e) => handleUpload(e)} size={200} url={fileUrl} />
        <label htmlFor='name' className='mt-12 w-full'>
          Name
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            placeholder='NFT name'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          Description
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
          Price
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
          Artist
          <span className='block text-tiny mt-1 mb-2'>This is the artist who will be credited for this NFT.</span>
          <Select
            options={artistOptions}
            onChange={setArtist}
            instanceId // Needed to prevent errors being thrown
            className='focus:outline-none focus:shadow-2xl dark:text-white'
            styles={selectStyles}
            disabled={loading}
          />
        </label>

        <label htmlFor='collection' className='mt-12 w-full'>
          Collection
          <span className='block text-tiny mt-1 mb-2'>This is the collection where your item will appear.</span>
          <Select
            options={collectionOptions}
            onChange={setCollection}
            instanceId // Needed to prevent errors being thrown
            styles={selectStyles}
            disabled={loading}
          />
        </label>

        {loading ?
          <div className='flex flex-col items-start justify-center'>
            <div id='mintingInfo' className='mt-16 text-xs'></div>
            <PulseLoader color={'var(--color-cta)'} size={20} />
            <p className='text-xs mt-4'>Please follow MetaMask prompt...</p>
          </div>
          :
          <button onClick={createNft} className='button button-cta mt-12'>Create</button>
        }
      </form>
    </>
  )
}

export async function getServerSideProps() {
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })

  return {
    props: { collections, artists },
  }
}

export default CreateNft
