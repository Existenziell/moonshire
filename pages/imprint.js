import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Imprint = () => {
  const user = supabase.auth.user()

  return (
    <>
      <Head>
        <title>Imprint | Project Moonshire</title>
        <meta name='description' content="Imprint | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center max-w-xl text-justify mx-auto'>
        <h1>Imprint</h1>
        <p className='text-justify '>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </>
  )
}

export default Imprint
