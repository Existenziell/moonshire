import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Nav = () => {
    const appCtx = useContext(AppContext)
    const { currentUser } = appCtx

    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const urls = [
        // { name: 'Releases', href: '/releases', title: 'Releases' },
        // { name: 'Live', href: '/live', title: 'Live' },
        { name: 'NFTs', href: '/nfts', title: 'nfts' },
        { name: 'Artists', href: '/artists', title: 'Artists' },
        { name: 'Collections', href: '/collections', title: 'Collections' },
        // { name: 'NFTs', href: '/nfts/nfts-listed', title: 'nfts' },
        // { name: 'NFTsMarket', href: '/nfts/nfts-market', title: 'nftsMarket' },
    ]
    if (currentUser?.roles?.name === 'Admin') urls.push({ name: 'Admin', href: '/admin', title: 'Admin' },)

    const intercept = (e) => {
        e.preventDefault()
        setIsOpen(false)
        router.push(e.target.href)
    }

    return (
        <nav className='w-full'>
            {/* Desktop menu */}
            <ul className="hidden md:flex justify-end items-center gap-6 pr-8 w-full text-[9px]">
                {urls.map(u => (
                    <li key={u.name}>
                        <Link href={u.href}>
                            <a
                                href={u.href}
                                className={`${router.pathname === u.href ? 'active-nav' : ''} hover:text-cta transition-all`}>
                                {u.name}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Mobile menu */}
            {isOpen &&
                <ul className='mobile-menu absolute md:hidden left-0 right-0 top-0 bottom-0 pt-28 z-20 h-screen w-screen bg-brand dark:bg-brand-dark'>
                    {urls.map(url => (
                        <li key={url.name}>
                            <a
                                href={url.href}
                                onClick={intercept}
                                className={`${router.pathname === url.href && 'active-nav'} 
                                w-full block text-2xl md:text-4xl text-center leading-loose px-8 py-2 md:py-8 
                                hover:bg-brand-dark dark:hover:bg-brand hover:text-cta transition-all`}>
                                {url.name}
                            </a>
                        </li>
                    ))}
                </ul>
            }

            {/* Mobile Hamburger Button */}
            <button className='mobile-menu-button md:hidden outline-none' onClick={() => setIsOpen(!isOpen)} aria-label='Open Mobile Navigation'>
                {!isOpen ?
                    <svg xmlns='http://www.w3.org/2000/svg' className='top-4 right-44 h-14 w-14 text-brand-dark dark:text-brand hover:text-cta dark:hover:text-cta  hover:scale-105 transition-all' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                        <path d='M4 6h16M4 12h16M4 18h16'></path>
                    </svg>
                    :
                    <svg xmlns='http://www.w3.org/2000/svg' className='absolute top-4 right-4 h-14 w-14 z-20 text-brand-dark dark:text-brand hover:text-cta dark:hover:text-cta hover:scale-105 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                }
            </button>

        </nav>
    )
}

export default Nav
