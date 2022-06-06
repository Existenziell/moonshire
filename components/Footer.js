import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import DarkModeToggle from './DarkModeToggle'

const Footer = () => {
  const { ref, inView } = useInView({})
  const fadeIn = useAnimation()

  useEffect(() => {
    inView ?
      fadeIn.start({
        opacity: 1,
        transition: {
          duration: 1.5,
        },
      })
      :
      fadeIn.start({
        opacity: 0,
      })
  }, [inView, fadeIn])

  return (
    <footer ref={ref} className='static bottom-0 flex items-center justify-between px-10 h-20 text-xs 
      text-black bg-brand dark:text-white dark:bg-brand-dark'>

      <div className='flex items-center justify-between w-full'>
        <DarkModeToggle />
        <div>
          <span className='text-tiny'>&copy; 2022 FE1</span>
          <Link href='/about'><a className='link text-tiny ml-4'>About</a></Link>
          <Link href='/imprint'><a className='link text-tiny ml-4'>Imprint</a></Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
