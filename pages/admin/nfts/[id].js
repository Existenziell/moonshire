/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../../lib/shortenAddress'
import useApp from "../../../context/App"
import BackBtn from '../../../components/admin/BackBtn'
import getProfile from '../../../lib/supabase/getProfile'
import fromExponential from 'from-exponential'

const NFT = ({ nft }) => {

  const { id, name, description, walletAddress, owner, price, tokenId, tokenURI, image_url, users, artists, collections, listed, featured } = nft
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

  const truncate = (input) => `${input.substring(0, 22)}...${input.substring(input.length - 12, input.length)}`

  return (
    <div className='mb-20 w-full relative'>
      <BackBtn href='/admin' />

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
            <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
            <span className=' relative bottom-[1px] ml-2'>Featured</span>
          </label>

          <div className='mt-16'>
            <h1 className='mb-0'>Assets</h1>
            <hr className='my-8' />
            {/* <p className='mb-4'>Physical <span className='text-gray-400'>(free shipping worldwide)</span></p>
            <p className='mb-4 mt-8'>Digital</p> */}
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
