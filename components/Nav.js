import { useRouter } from 'next/router'
import useApp from "../context/App"
import Link from 'next/link'

const Nav = () => {
  const { currentUser } = useApp()
  const router = useRouter()

  const urls = [
    // { name: 'About', href: '/about', title: 'about' },
    { name: 'NFTs', href: '/nfts', title: 'nfts' },
    { name: 'Artists', href: '/artists', title: 'Artists' },
    { name: 'Collections', href: '/collections', title: 'Collections' },
    // { name: 'NFTs', href: '/nfts/nfts-listed', title: 'nfts' },
    // { name: 'NFTsMarket', href: '/nfts/nfts-market', title: 'nftsMarket' },
  ]
  if (currentUser?.roles?.name === 'Admin') urls.push({ name: 'Admin', href: '/admin', title: 'Admin' },)

  return (
    <nav className='w-full'>
      <ul className="flex justify-start xs:justify-end items-center gap-6 pr-8 w-full text-tiny">
        {urls.map(u => (
          <li key={u.name}>
            <Link href={u.href}>
              <a
                href={u.href}
                className={`${router.pathname.startsWith(u.href) ? 'active-nav' : ''} hover:text-cta transition-all uppercase font-serif`}>
                {u.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
