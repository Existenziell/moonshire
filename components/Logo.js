import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a className="pt-4 pl-4 md:pt-14 md:pl-20 flex-shrink-0">
        <img src="/logo.png" alt="Moonshire Logo" className=" dark:hidden w-28 md:w-max" />
        <img src="/logo-dark.png" alt="Moonshire Logo Dark" className="hidden dark:block" width={168} height={110} />
      </a>
    </Link>
  )
}

export default Logo
