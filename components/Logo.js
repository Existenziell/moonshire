import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a className="bg-brand dark:bg-brand-dark pt-14 pl-20">
        <img src="/logo.png" alt="Moonshire Logo" className=" dark:hidden" />
        <img src="/logo-dark.png" alt="Moonshire Logo Dark" className="hidden dark:block" />
      </a>
    </Link>
  )
}

export default Logo
