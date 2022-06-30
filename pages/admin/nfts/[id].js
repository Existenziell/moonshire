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

      <form onSubmit={saveNft} className='edit-user flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-10'>Edit NFT</h1>

        <div className='flex flex-col md:flex-row gap-10 items-start justify-start mb-10'>
          <img src={image_url} alt='NFT Image' className='max-w-xs shadow-2xl rounded-sm' />

          <div>
            <h2 className='mb-0'>Name</h2>
            {name}
            <label htmlFor="featured" className="cursor-pointer flex items-center justify-center whitespace-nowrap mt-10">
              <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="w-8 h-8 text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
              <span className='relative bottom-1 ml-4 text-[30px]'>Featured on Startpage</span>
            </label>
          </div>
        </div>

        <p className='mb-2'>Artist: {artists.name}</p>
        <p className='mb-2'>Collection: {collections.title}</p>
        <p className='mb-2'>Created by: {users.username}</p>
        <p className='mb-8'>Description: {description}</p>

        <p className='mb-2'>TokenID: {tokenId}</p>
        <p className='mb-2'>Currently listed: {listed ? `Yes` : `No`}</p>
        <p className='mb-2'>Current owner: {shortenAddress(walletAddress)} ({owner})</p>
        <p className='mb-2'>{listed ? `Current price:` : `Last price:`} {fromExponential(price)} ETH</p>
        <p className='mb-2 whitespace-nowrap'>TokenURI: <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{truncate(tokenURI)}</a></p>

        <input type='submit' className='button button-cta mt-12' value='Save' disabled={loading} />
      </form >
    </div >
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
