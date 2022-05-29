import { useState, useEffect } from 'react'

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState()

  useEffect(() => {
    // Check for user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark()
    } else {
      // else check localstorage
      if (localStorage.theme === 'dark') {
        setDark()
      } else {
        setLight()
      }
    }
  }, [])

  const setLight = () => {
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    setDarkMode(false)
  }

  const setDark = () => {
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
    setDarkMode(true)
  }

  return (
    <section>
      {!darkMode ?
        <svg onClick={setDark} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 cursor-pointer text-brand-dark dark:text-brand hover:text-cta dark:hover:text-cta hover:scale-105 transition-all' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
        </svg>
        :
        <svg onClick={setLight} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 cursor-pointer text-brand-dark dark:text-brand hover:text-cta dark:hover:text-cta hover:scale-105 transition-all' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
      }
    </section>
  )
}

export default DarkModeToggle
