import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import DarkModeToggle from './DarkModeToggle'

const Footer = () => {
  const router = useRouter()

  useEffect(() => {
    const body = document.body
    const scrollUp = "scroll-up"
    const scrollDown = "scroll-down"
    const bottom = "bottom"

    let lastScroll = 0

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset

      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp)
        body.classList.add(scrollDown)
      } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
        // up
        body.classList.remove(scrollDown)
        body.classList.remove(bottom)
        body.classList.add(scrollUp)
      }

      if (currentScroll <= 0) {
        // top
        body.classList.remove(scrollUp)
        return
      }

      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        // bottom
        body.classList.add(bottom)
      }

      lastScroll = currentScroll
    })
  }, [])

  return (
    <footer className={`${router.pathname === ('/') ? `fixed bottom-0 w-full bg-transparent` : `sticky-footer bg-brand dark:bg-brand-dark`} flex items-center justify-between px-[40px] h-20 text-xs text-black dark:text-white`}>
      <div className='flex items-center justify-between w-full'>
        <DarkModeToggle />
        <div>
          <span className='text-tiny'>&copy; 2022 FE1</span>
          <Link href='/help'><a className={`${router.pathname === '/help' ? 'active-nav' : ''} link text-tiny ml-4 uppercase font-serif`}>Help</a></Link>
          <Link href='/about'><a className={`${router.pathname === '/about' ? 'active-nav' : ''} link text-tiny ml-4 uppercase font-serif`}>About</a></Link>
          {/* <Link href='/imprint'><a className={`${router.pathname === '/imprint' ? 'active-nav' : ''} link text-tiny ml-4 uppercase font-serif`}>Imprint</a></Link> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
