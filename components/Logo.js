import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a className="pt-0 pl-4 md:pt-14 md:pl-20 md:flex-shrink-0">
        <img src="/logo.png" alt="Moonshire Logo" className="dark:hidden w-28 md:w-max" />
        <img src="/logo-dark.png" alt="Moonshire Logo Dark" className="hidden dark:block w-28 md:w-max" />
      </a>
    </Link>
  )
}

export default Logo
