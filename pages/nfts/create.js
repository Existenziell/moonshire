import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import UploadImage from '../../components/UploadImage'
import Select from 'react-select'

const CreateNft = ({ artists, collections }) => {
  const appCtx = useContext(AppContext)
  const { notify, darkmode } = appCtx

  const [imageUrl, setImageUrl] = useState(null)
  const [formData, setFormData] = useState({})

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const setCollection = (e) => {
    setFormData({ ...formData, ...{ collection: e.value } })
  }

  const setArtist = (e) => {
    setFormData({ ...formData, ...{ artist: e.value } })
  }

  const saveNft = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('nfts')
      .insert([{
        ...formData
      }])

    if (!error) {
      notify("NFT created successfully!")
      setFormData(null)
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

  return (
    <>
      <Head>
        <title>Create NFT | Project Moonshire</title>
        <meta name='description' content="Create NFT | Project Moonshire" />
      </Head>

      <form onSubmit={saveNft} className='create-nft flex flex-col items-start max-w-2xl mx-auto pb-24'>
        <h1 className='mx-auto'>Create NFT</h1>

        <p>Image, Video, Audio, or 3D Model</p>
        <p className='text-tiny mb-4'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</p>
        <UploadImage
          bucket='nfts'
          url={imageUrl}
          size={250}
          onUpload={(url) => {
            setFormData({ ...formData, image_url: url })
            setImageUrl(url)
          }}
        />

        <label htmlFor='name' className='mt-12 w-full'>
          Name
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            placeholder='NFT name'
            className='block mt-2 w-full'
          />
        </label>

        <label htmlFor='desc' className='mt-12 w-full'>
          Description
          <span className='block text-tiny mt-1'>The description will be included on the item&apos;s detail page underneath its image</span>
          <textarea
            name='desc' id='desc' rows={10}
            onChange={setData} required
            placeholder="Provide a detailed description of your item."
            className='block mt-2 w-full'
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
          />
        </label>

        <input type='submit' className='button button-cta mt-12' value='Create' />
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
