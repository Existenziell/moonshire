import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import useApp from "../../../context/App"
import BackBtn from '../../../components/admin/BackBtn'

const NFT = ({ nft }) => {

  const { id, name, description, walletAddress, price, tokenId, tokenURI, image_url, users, artists, collections, listed, featured } = nft
  const { notify } = useApp()
  const [loading, setLoading] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const router = useRouter()

  const saveNft = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('nfts')
      .update({
        featured: isFeatured
      })
      .eq('id', id)

    if (!error) {
      notify("NFT updated successfully!")
      setLoading(false)
      router.push('/admin')
    }
  }

  return (
    <div className='mb-20 w-full relative'>
      <BackBtn href='/admin' />

      <form onSubmit={saveNft} className='edit-user flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-10'>Edit NFT</h1>

        <div className='flex flex-col md:flex-row gap-10 items-start justify-start'>
          <img src={image_url} alt='NFT Image' className='max-w-xs shadow-2xl rounded-sm' />

          <div>
            <div>
              <h2 className='mb-0'>Name</h2>
              {name}
            </div>
            <div>
              <h2 className='mb-0 mt-8'>Description</h2>
              {description}
            </div>

          </div>
        </div>

        <div>
          <h2 className='mb-0 mt-8'>Artist</h2>
          {artists.name}
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Collection</h2>
          {collections.title}
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Created by</h2>
          {users.username}
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Current Owner</h2>
          {shortenAddress(walletAddress)}
        </div>

        <div>
          <h2 className='mb-0 mt-8'>TokenID</h2>
          {tokenId}
        </div>
        <div>
          <h2 className='mb-0 mt-8'>TokenURI</h2>
          <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{tokenURI}</a>
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Currently listed</h2>
          {listed ? `Yes` : `No`}
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Last price</h2>
          {price} ETH
        </div>
        <div>
          <h2 className='mb-0 mt-8'>Featured on Startpage</h2>
          <div className="flex items-center mr-4">
            <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="w-4 h-4 text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
            <label htmlFor="featured" className="ml-2 cursor-pointer">Featured on Startpage</label>
          </div>
        </div>

        <input type='submit' className='button button-cta mt-12' value='Save' disabled={loading} />
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

  return {
    props: { nft },
  }
}

export default NFT
