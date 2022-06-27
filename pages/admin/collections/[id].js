import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { getPublicUrl } from '../../../lib/supabase/getPublicUrl'
import useApp from "../../../context/App"
import UploadImage from '../../../components/UploadImage'
import { useRouter } from 'next/router'

const Collection = ({ collection }) => {
  const { id, title, headline, description, year, featured, image_url } = collection
  const { notify } = useApp()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [isFeatured, setIsFeatured] = useState()
  const router = useRouter()

  useEffect(() => {
    setImageUrl(image_url)
    setIsFeatured(featured)
  }, [image_url])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const saveCollection = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('collections')
      .update({
        image_url: imageUrl,
        title: formData.title ? formData.title : title,
        headline: formData.headline ? formData.headline : headline,
        description: formData.description ? formData.description : description,
        year: formData.year ? formData.year : year,
        featured: isFeatured,
      })
      .eq('id', id)

    if (!error) {
      notify("Collection updated successfully!")
      setLoading(false)
      setFormData(null)
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    }
  }

  return (
    <div className='mb-20 w-full'>
      <div className='flex justify-between items-center'>
      </div>

      <form onSubmit={saveCollection} className='edit-collection flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-6'>Edit Collection</h1>

        <UploadImage
          bucket='collections'
          url={imageUrl}
          size={200}
          onUpload={(url) => {
            setFormData({ ...formData, image_url: url })
            setImageUrl(url)
          }}
        />

        <label htmlFor='title' className='mt-12 w-full'>
          <h2 className='mb-2'>Title</h2>
          <input
            type='text' name='title' id='title'
            onChange={setData} required
            defaultValue={title}
            placeholder='Collection Title'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='headline' className='mt-12 w-full'>
          <h2 className='mb-2'>Headline</h2>
          <input
            type='text' name='headline' id='headline'
            onChange={setData} required
            defaultValue={headline}
            placeholder='Collection Headline'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          <h2 className='mb-2'>Description</h2>
          <textarea
            name='description' id='description' rows={10}
            onChange={setData} required
            defaultValue={description}
            placeholder="Provide a detailed description of your collection."
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='year' className='mt-12 w-full'>
          <h2 className='mb-2'>Year</h2>
          <input
            type='text' name='year' id='year'
            onChange={setData} required
            defaultValue={year}
            placeholder='Year of Appearance'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='featured' className='mt-12 w-full'>
          <h2 className='mb-2'>Featured</h2>
          <div className="flex items-center mr-4">
            <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="w-4 h-4 text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
            <label htmlFor="featured" className="ml-2">Featured on Startpage</label>
          </div>
        </label >

        <input type='submit' className='button button-cta mt-12' value='Save' disabled={loading} />
      </form >
    </div >
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })

  if (!collection) {
    return {
      redirect: {
        permanent: false,
        destination: "/collections",
      },
      props: {}
    }
  }

  // Set public IPFS url for collection cover image
  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Set Number of NFTs in collection
  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  if (collectionNfts.length > 0) {

    // Collect artists that have NFTs in this collection
    let collectionArtists = []
    for (let nft of collectionNfts) {
      collectionArtists.push(nft.artists.name)
    }

    /* eslint-disable no-undef */
    const uniqueCollectionArtists = [...new Set(collectionArtists)]
    /* eslint-enable no-undef */
    collection.artists = uniqueCollectionArtists

    // Set floor and highest price
    let floorPrice = 1000000
    let highestPrice = 0

    for (let nft of collectionNfts) {
      if (highestPrice < nft.price) {
        highestPrice = nft.price
      }
      if (floorPrice > nft.price) {
        floorPrice = nft.price
      }
    }
    collection.floorPrice = floorPrice
    collection.highestPrice = highestPrice
  }

  return {
    props: { collection, collectionNfts },
  }
}

export default Collection
