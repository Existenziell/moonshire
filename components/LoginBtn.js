import Link from 'next/link'

const LoginBtn = () => {

  return (
    <Link href='/profile' >
      <a className="block" name='profile' aria-label='Go to Profile'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand hover:text-slate-400 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </a>
    </Link>
  )
}

export default LoginBtn
