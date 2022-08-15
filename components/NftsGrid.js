import Link from "next/link"
import { useEffect, useState } from "react"
// import { shortenAddress } from '../lib/shortenAddress'

const NftsGrid = ({ nfts, display, view }) => {
  const [filteredNfts, setFilteredNfts] = useState(nfts)

  const truncate = (input) => input.length > 30 ? `${input.substring(0, 30)}...` : input

  const calculateWidth = () => {
    let items
    if (view === 'all') items = nfts
    if (view === 'available') items = nfts.filter(n => { return n.listed === true })
    if (view === 'sold') items = nfts.filter(n => { return n.listed === false })

    const template = document.getElementById('template')
    const width = template.offsetWidth + 20 // get current desired width of elements
    const elPerLine = Math.floor(window.innerWidth / width) // how many elements fit per line?
    const factor = items?.length / elPerLine // do we need to add elements?
    const overhang = items?.length % elPerLine // how many elements are overhanging?
    const missing = elPerLine - overhang // how many elements need to be added?

    // If there are NOT enough elements to fill all lines, add 'missing' amount
    let elements = []
    if (factor % 1 !== 0) { // Check if factor is NOT a full number => missing element(s)
      for (let i = 0; i < missing; i++) {
        elements.push({
          "id": "fake",
          "fake": true
        })
      }
    }
    setFilteredNfts([...items, ...elements])
  }

  useEffect(() => {
    calculateWidth()
    window.addEventListener('resize', function () {
      calculateWidth()
    }, true)

  }, [nfts])

  return (
    <div className={`${display === 'grid' ? `flex` : `hidden`} flex-wrap justify-between gap-20 mt-20`}>
      {filteredNfts?.map((nft, i) => (
        <div
          key={i}
          id={(i === 0) ? `template` : ``}
          className={`flex flex-col justify-between mb-20 w-full flex-grow flex-shrink basis-0 md:min-w-[350px]`}
        >
          {nft.fake ?
            <div className="h-full"></div>
            :
            <>
              <Link href={`/nfts/${nft.id}`}>
                <a>
                  <img
                    src={nft.image_url ? nft.image_url : nft.image}
                    alt='NFT Image'
                    className='w-full aspect-square object-cover shadow-2xl bg-detail dark:bg-detail-dark'
                  />
                </a>
              </Link>

              <div className="flex flex-col justify-between h-full">
                <h1 className='mt-8 mb-6 h-16'>{truncate(nft.name)}</h1>
                <div className="text-detail-dark dark:text-detail">
                  {/* <p>{nft.description}</p> */}
                  <div className='mb-2'>
                    <Link href={`/collections/${nft.collections?.id}`}>
                      <a className='link-white'>
                        {nft.collections?.title ? nft.collections.title : nft.collection}
                      </a>
                    </Link>
                  </div>
                  <div className='mb-10'>
                    <Link href={`/artists/${nft.artists?.id}`}>
                      <a className='link-white'>
                        {nft.artists?.name ? nft.artists.name : nft.artist}
                      </a>
                    </Link>
                  </div>
                  <hr />

                  {/* {nft.owner && nft.seller &&
                <>
                  <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                  <p>Seller: {shortenAddress(nft.seller)}</p>
                </>
              } */}
                </div>
                <div className="flex justify-between gap-8 items-center mt-6">
                  <h1 className="mb-0 whitespace-nowrap">{nft.price} ETH</h1>
                  <Link href={`/nfts/${nft.id}`}>
                    <a className='button button-cta uppercase'>
                      View
                    </a>
                  </Link>
                </div>
              </div>
            </>
          }
        </div>
      ))}
    </div >
  )
}

export default NftsGrid
