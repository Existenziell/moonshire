import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <a className="flex-shrink-0">
        <svg className="h-[60px] w-max text-black dark:text-white hover:text-cta dark:hover:text-cta transition-colors" viewBox="0 0 758.000000 600.000000" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)" fill="currentColor">
            <path d="M6965 5826 l-600 -172 -3 -87 c-2 -57 1 -87 8 -87 6 0 231 63 500 140 269 77 494 140 500 140 7 0 10 -455 10 -1410 0 -775 3 -1410 8 -1410 4 0 48 13 97 29 l90 28 3 1501 c1 826 -1 1502 -5 1501 -5 0 -278 -78 -608 -173z" />
            <path d="M5143 4575 c-865 -269 -1575 -493 -1578 -497 -7 -7 -7 -3129 -1 -3136 2 -2 685 209 1518 468 832 260 1541 481 1576 491 l62 20 0 90 c0 80 -2 90 -16 85 -27 -10 -2897 -904 -2926 -911 l-28 -7 0 1034 0 1035 743 231 c408 128 1080 337 1492 466 l750 233 3 87 c2 65 0 86 -10 86 -7 0 -677 -207 -1489 -460 -812 -253 -1479 -460 -1483 -460 -3 0 -5 120 -4 267 l3 267 1480 462 1480 461 3 46 c2 26 2 66 0 90 l-3 43 -1572 -491z" />
            <path d="M1578 3477 l-1578 -492 0 -1492 c0 -821 1 -1493 3 -1493 1 0 42 13 92 29 l90 29 3 1038 c1 579 6 1042 11 1047 5 5 676 217 1492 471 l1484 462 3 92 3 91 -58 -19 c-80 -27 -2882 -899 -2910 -906 l-23 -6 0 266 0 266 23 10 c24 10 2943 920 2952 920 3 0 5 41 5 90 0 50 -3 90 -7 89 -5 0 -718 -222 -1585 -492z" />
          </g>
        </svg>
        {/* <img src="/logo.svg" alt="Moonshire Logo" className="dark:hidden h-[60px]" /> */}
        {/* <img src="/logo-dark.svg" alt="Moonshire Logo Dark" className="hidden dark:block h-[60px]" /> */}
      </a>
    </Link>
  )
}

export default Logo
