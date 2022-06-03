import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { getMeta } from '../../lib/market/getMeta'
import resellNft from '../../lib/market/resellNft'
import { PulseLoader } from 'react-spinners'

export default function ResellNft() {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx
  const [loading, setLoading] = useState(false)
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const { image, price } = formInput

  const router = useRouter()
  const { library: provider } = useWeb3React()
  const { id, tokenURI } = router.query

  useEffect(() => {
    fetchNft()
  }, [id, provider])

  async function fetchNft() {
    if (!tokenURI) return
    const meta = await getMeta(tokenURI)
    updateFormInput(state => ({
      ...state,
      image: meta.data.image,
    }))
  }

  async function initiateResell(e) {
    e.preventDefault()
    if (!provider) {
      notify("Please connect your wallet first")
      return
    }
    if (!price) {
      notify("Are you sure you want to sell it for that price...?")
      return
    }
    setLoading(true)

    const hash = await resellNft(id, price, provider)
    if (hash) {
      setLoading(false)
      setTimeout(() => {
        router.push('/profile')
      }, 3000)
    } else {
      notify("Something went horribly wrong...")
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <form className="shadow-2xl rounded flex flex-col items-center max-w-xs p-6">
          <p className='text-xs'>Price in ETH</p>
          <input
            placeholder="0.25"
            className="text-4xl bg-brand dark:bg-brand-dark text-center rounded py-2 w-full
            focus:border-none focus:outline-none focus:scale-105 transition-all"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            required
          />
          {image && <img className="rounded mt-4" src={image} alt='NFT Image' />}
          {loading ?
            <div className='mt-8'>
              <PulseLoader color={'var(--color-cta)'} size={10} />
            </div>
            :
            <button onClick={initiateResell} className="mt-4 button button-cta">
              List NFT
            </button>
          }
        </form>

      </div>
      <div className='flex flex-col justify-center items-center mt-12 text-sm'>
        <p>TokenURI</p>
        <a href={tokenURI} target='_blank' rel='noopener noreferrer' className='link'>{tokenURI}</a>
      </div>
    </div>
  )
}