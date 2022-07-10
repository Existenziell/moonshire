import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchMeta } from '../../lib/contract/fetchMeta'
import { PulseLoader } from 'react-spinners'
import resellNft from '../../lib/contract/resellNft'
import setItemPrice from '../../lib/supabase/setItemPrice'
import setItemListedState from '../../lib/supabase/setItemListedState'
import useApp from "../../context/App"

export default function ResellNft() {
  const { address, signer, notify } = useApp()
  const [loading, setLoading] = useState(false)
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const { image, price } = formInput

  const router = useRouter()
  const { id, tokenURI } = router.query

  useEffect(() => {
    fetchNft()
  }, [id, signer])

  async function fetchNft() {
    if (!tokenURI) return
    const meta = await fetchMeta(tokenURI)
    updateFormInput(state => ({
      ...state,
      image: meta.data.image,
    }))
  }

  async function initiateResell(e) {
    e.preventDefault()
    if (!address) {
      notify("Please connect your wallet to proceed")
      return
    }
    if (!price) {
      notify("Please enter a price first")
      return
    }

    setLoading(true)
    const hash = await resellNft(id, price, signer)

    if (hash) {
      await setItemListedState(id, true)
      await setItemPrice(id, tokenURI, price)
      notify(`Item succesfully listed on the market for ${price} ETH`)
      setLoading(false)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } else {
      notify("Something went horribly wrong...")
    }
  }

  return (
    <div>
      <div className="flex justify-center px-[40px]">
        <form autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className="list-nft flex flex-col items-center">
          <h1>Enter price in ETH:</h1>
          <input
            type='text' required
            placeholder="e.g. 0.25"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            className='text-center'
            disabled={loading}
          />
          {loading ?
            <div className='mt-8 text-center'>
              <PulseLoader color={'var(--color-cta)'} size={10} />
              <p className='text-xs'>Waiting for blockchain confirmation...</p>
            </div>
            :
            <button onClick={initiateResell} className="mt-10 button button-cta">
              List NFT
            </button>
          }
        </form>

      </div>
      <div className='flex flex-col justify-center items-center mt-20 text-sm'>
        {image && <img className="rounded-sm shadow-xl max-w-xs mb-8" src={image} alt='NFT Image' />}

        <p>TokenURI</p>
        <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{tokenURI}</a>
      </div>
    </div>
  )
}
