import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a className="flex-shrink-0">
        <img src="/logo.png" alt="Moonshire Logo" className="dark:hidden h-[60px]" />
        <img src="/logo-dark.png" alt="Moonshire Logo Dark" className="hidden dark:block h-[60px]" />
      </a>
    </Link>
  )
}

export default Logo
