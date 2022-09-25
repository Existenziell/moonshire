import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a role="link" aria-label="Navigate to Home" className="flex-shrink-0">
        <img src="logo.svg" width={200} className='dark:invert' alt="Moonshire Logo" />
      </a>
    </Link>
  )
}

export default Logo
