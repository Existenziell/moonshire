import { ChevronLeftIcon } from "@heroicons/react/outline"
import Link from "next/link"

const BackBtn = ({ href }) => (
  <Link href={href}>
    <a>
      <ChevronLeftIcon className='h-12 w-12 absolute top-3 left-4 text-brand-dark/20 dark:text-brand/20 hover:text-cta dark:hover:text-cta transition-all duration-100' />
    </a>
  </Link>
)

export default BackBtn
