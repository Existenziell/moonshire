import { useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Social from '../components/Social'
import PacmanLoader from 'react-spinners/PacmanLoader'

const Contact = () => {

  const [formData, setFormData] = useState()
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const submitForm = async e => {
    e.preventDefault()
    setSending(true)
    let data = { ...formData }

    try {
      const res = await fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      res.ok ?
        Router.push('/success')
        :
        setErrorMsg(`Sorry, an error occured: ${res.statusText}`)
    } catch (error) {
      setErrorMsg('Sorry, an error occured. Have you tried turning it off and on again?')
    }
  }

  return (
    <>
      <Head>
        <title>Contact | Project Moonshire</title>
        <meta name='description' content='Contact | Project Moonshire' />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-4xl md:text-6xl mb-12 mt-4'>Contact</h1>
        <div className='md:flex items-center gap-8 md:text-right'>
          <div className='md:w-2/3'>
            <p className='text-lg mx-auto leading-relaxed mb-8 max-w-sm'>
              Please leave any suggestions or feedback, it is always very welcome. We are excited to hear from you!
            </p>
          </div>
          <img src='/logo.png' alt='Logo' className='md:w-1/2 shadow rounded' />
        </div>

        <Social />

        <div className='z-0 px-4 pt-8 pb-0 sm:px-12 shadow w-full bg-cover bg-no-repeat bg-poly rounded-lg bg-white/10 backdrop-blur-md text-white'>
          <form onSubmit={submitForm}>
            <div className='relative mb-8 text-white'>
              <input
                id='name' name='name' type='text'
                onChange={setData} required disabled={sending}
                className='peer h-10 w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none' placeholder='Name'
              />
              <label htmlFor='name'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>Name</label>
            </div>
            <div className='relative mb-8'>
              <input
                id='email' type='email' name='email'
                onChange={setData} required disabled={sending}
                className='peer h-10 w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none' placeholder='Email'
              />
              <label htmlFor='email'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>Email</label>
            </div>
            <div className='relative'>
              <textarea
                id='message' name='message'
                onChange={setData} rows='10' required disabled={sending}
                className='peer h-full w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none py-4' placeholder='Message'>
              </textarea>
              <label htmlFor='message'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>Message</label>
            </div>

            {errorMsg ?
              <div className='text-left bg-brand text-white p-4'>
                {errorMsg}
              </div>
              :
              sending ?
                <div className='my-8 h-16 mr-16 opacity-60'>
                  <PacmanLoader color={'white'} size={30} />
                </div>
                :
                <input type='submit' className='button my-4' aria-label='Send Contact Form' value='Send'></input>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Contact
