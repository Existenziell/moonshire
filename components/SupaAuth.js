import { Auth } from '@supabase/ui'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

const SupaAuth = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Authentication | Project Moonshire</title>
        <meta name='description' content="Authentication | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 md:px-8'>
        <div className='max-w-xl'>
          <Auth.UserContextProvider supabaseClient={supabase}>
            <Auth
              supabaseClient={supabase}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
              socialColors={false}
              magicLink
              redirectTo={process.env.NEXT_PUBLIC_APP_BASE_URL + router.pathname}
              providers={['google', 'facebook', 'github']}
            />
          </Auth.UserContextProvider>
        </div>
      </div>
    </>
  )
}

export default SupaAuth
