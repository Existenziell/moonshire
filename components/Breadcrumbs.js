import Link from 'next/link'

const Breadcrumbs = ({ backPath, currentPath }) => {
  return (
    <div className='flex justify-between items-center w-full mb-4'>
      <Link href={backPath}>
        <a className='p-2 shadow hover:shadow-sm rounded hover:text-cta transition-all'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </Link>
      <p className='text-xs'>
        {currentPath}
      </p>
    </div>
  )
}

export default Breadcrumbs
